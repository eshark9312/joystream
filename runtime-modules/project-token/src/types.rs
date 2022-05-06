use codec::{Decode, Encode};
use frame_support::{
    dispatch::{fmt::Debug, DispatchError, DispatchResult},
    ensure,
    traits::Get,
};
use sp_arithmetic::traits::{AtLeast32BitUnsigned, One, Saturating, Unsigned, Zero};
use sp_runtime::{
    traits::{Convert, Hash, UniqueSaturatedInto},
    PerThing, Permill, Perquintill, SaturatedConversion,
};
use sp_std::{
    cmp::max,
    collections::btree_map::{BTreeMap, IntoIter, Iter},
    convert::TryInto,
    iter::Sum,
};

use storage::{BagId, DataObjectCreationParameters};

// crate imports
use crate::{errors::Error, Trait};

/// Source of tokens subject to vesting that were acquired by an account
/// either through purchase or during initial issuance
#[derive(Encode, Decode, Clone, PartialEq, Eq, Debug, PartialOrd, Ord)]
pub enum VestingSource {
    InitialIssuance,
    Sale(TokenSaleId),
}

/// Represent's account's split staking status
#[derive(Encode, Decode, Clone, PartialEq, Eq, Debug, PartialOrd, Ord)]
pub struct StakingStatus<Balance> {
    // Id of the split
    // TODO: SplitId
    split_id: u32,

    // The amount staked for the split
    amount: Balance,
}

impl<Balance: Copy> StakingStatus<Balance> {
    pub(crate) fn locks<BlockNumber>(&self, _b: BlockNumber) -> Balance {
        // TODO: Implement
        self.amount
    }
}

/// Info for the account
#[derive(Encode, Decode, Clone, PartialEq, Eq, Debug)]
pub struct AccountData<VestingSchedule, Balance, StakingStatus, JoyBalance> {
    /// Map that represents account's vesting schedules indexed by source.
    /// Account's total unvested (locked) balance at current block (b)
    /// can be calculated by summing `v.locks()` of all
    /// VestingSchedule (v) instances in the map.
    pub(crate) vesting_schedules: BTreeMap<VestingSource, VestingSchedule>,

    /// Represents total amount of tokens held by the account, including
    /// unvested and staked tokens.
    pub(crate) amount: Balance,

    /// Account's current split staking status
    pub(crate) split_staking_status: Option<StakingStatus>,

    /// Bloat bond (in 'JOY's) deposited into treasury upon creation of this
    /// account, returned when this account is removed
    pub(crate) bloat_bond: JoyBalance,
}

/// Info for the token
#[derive(Encode, Decode, Clone, PartialEq, Eq, Default, Debug)]
pub struct TokenData<Balance, Hash, BlockNumber, TokenSale, RevenueSplitState> {
    /// Current token's total supply (tokens_issued - tokens_burned)
    pub(crate) total_supply: Balance,

    /// Total number of tokens issued
    pub(crate) tokens_issued: Balance,

    // TODO: Limit number of sales per token?
    /// Number of sales initialized, also serves as unique identifier
    /// of the current sale (`last_sale`) if any.
    pub(crate) sales_initialized: TokenSaleId,

    /// Last token sale (upcoming / ongoing / past)
    pub(crate) last_sale: Option<TokenSale>,

    /// Transfer policy
    pub(crate) transfer_policy: TransferPolicy<Hash>,

    /// Symbol used to identify token
    pub(crate) symbol: Hash,

    /// Patronage Information
    pub(crate) patronage_info: PatronageData<Balance, BlockNumber>,

    /// Account counter
    pub(crate) accounts_number: u64,

    /// Revenue Split state info
    pub(crate) revenue_split: RevenueSplitState,

    /// Latest Token Revenue split (active / inactive)
    pub(crate) latest_revenue_split_id: RevenueSplitId,
}

/// Revenue Split State
#[derive(Encode, Decode, Clone, PartialEq, Eq, Debug)]
pub enum RevenueSplitState<JoyBalance, BlockNumber> {
    /// Inactive state: no split ongoing
    Inactive,

    /// Active state: split ongoing with info
    Active(RevenueSplitInfo<JoyBalance, BlockNumber>),
}

impl<JoyBalance, BlockNumber: Copy> RevenueSplitState<JoyBalance, BlockNumber> {
    pub fn ensure_inactive<T: Trait>(&self) -> DispatchResult {
        ensure!(
            matches!(&self, &Self::Inactive),
            Error::<T>::RevenueSplitAlreadyActiveForToken
        );

        Ok(())
    }

    pub fn ensure_active<T: Trait>(&self) -> Result<Timeline<BlockNumber>, DispatchError> {
        match &self {
            RevenueSplitState::Inactive => Err(Error::<T>::RevenueSplitNotActiveForToken.into()),
            RevenueSplitState::<JoyBalance, BlockNumber>::Active(info) => Ok(info.timeline.clone()),
        }
    }
}

/// Revenue Split Information for an *Active* revenue split
#[derive(Encode, Decode, Clone, PartialEq, Eq, Debug)]
pub struct RevenueSplitInfo<Balance, BlockNumber> {
    /// Remaning allocation
    pub(crate) allocation_left: Balance,

    /// Split timeline [start, start + duration)
    pub(crate) timeline: Timeline<BlockNumber>,
}

impl<Balance, BlockNumber: Copy + PartialOrd + Saturating> RevenueSplitState<Balance, BlockNumber> {
    pub fn activate(&mut self, allocation: Balance, timeline: Timeline<BlockNumber>) {
        *self = RevenueSplitState::<_, _>::Active(RevenueSplitInfo {
            allocation_left: allocation,
            timeline,
        });
    }

    pub fn deactivate(&mut self) {
        *self = RevenueSplitState::Inactive;
    }
}

impl<Balance, BlockNumber> Default for RevenueSplitState<Balance, BlockNumber> {
    fn default() -> Self {
        RevenueSplitState::<Balance, BlockNumber>::Inactive
    }
}

/// Defines a range [start, start + duration)
#[derive(Encode, Decode, Clone, PartialEq, Eq, Debug)]
pub struct Timeline<BlockNumber> {
    pub start: BlockNumber,
    pub duration: BlockNumber,
}

impl<BlockNumber: Copy + Saturating + PartialOrd> Timeline<BlockNumber> {
    pub fn try_from_params<T: Trait>(
        start: BlockNumber,
        duration: BlockNumber,
        current_block: BlockNumber,
    ) -> Result<Self, DispatchError> {
        ensure!(
            current_block <= start,
            Error::<T>::RevenueSplitStartingBlockInThePast
        );

        Ok(Timeline::<_> { start, duration })
    }

    pub fn end(&self) -> BlockNumber {
        return self.start.saturating_add(self.duration);
    }

    /// Wether current block in [self.end(), INFINITY)
    pub fn is_ended(&self, current_block: BlockNumber) -> bool {
        return self.end() <= current_block;
    }

    /// Wether current block in [self.start, INFINITY)
    pub fn is_started(&self, current_block: BlockNumber) -> bool {
        return current_block >= self.start;
    }

    /// Wether current block in [self.start, self.end())
    pub fn is_ongoing(&self, current_block: BlockNumber) -> bool {
        return self.is_started(current_block) && !self.is_ended(current_block);
    }
}

/// Patronage information, patronage configuration = set of values for its fields
#[derive(Encode, Decode, Clone, PartialEq, Eq, Default, Debug)]
pub struct PatronageData<Balance, BlockNumber> {
    /// Patronage rate
    pub(crate) rate: BlockRate,

    /// Tally count for the outstanding credit before latest patronage config change
    pub(crate) unclaimed_patronage_tally_amount: Balance,

    /// Last block the patronage configuration was updated
    pub(crate) last_unclaimed_patronage_tally_block: BlockNumber,
}

/// Input parameters describing token transfer policy
#[derive(Encode, Decode, Clone, PartialEq, Eq, Debug)]
pub enum TransferPolicyParams<WhitelistParams> {
    /// Permissionless
    Permissionless,

    /// Permissioned transfer with whitelist
    Permissioned(WhitelistParams),
}

impl<WhitelistParams> Default for TransferPolicyParams<WhitelistParams> {
    fn default() -> Self {
        Self::Permissionless
    }
}

/// The two possible transfer policies
#[derive(Encode, Decode, Clone, PartialEq, Eq, Debug)]
pub enum TransferPolicy<Hash> {
    /// Permissionless
    Permissionless,

    /// Permissioned transfer with whitelist commitment
    Permissioned(Hash),
}

// TransferPolicyParams => TransferPolicy conversion
impl<Hash, SingleDataObjectUploadParams>
    From<TransferPolicyParams<WhitelistParams<Hash, SingleDataObjectUploadParams>>>
    for TransferPolicy<Hash>
{
    fn from(
        params: TransferPolicyParams<WhitelistParams<Hash, SingleDataObjectUploadParams>>,
    ) -> Self {
        match params {
            TransferPolicyParams::Permissioned(whitelist_params) => {
                Self::Permissioned(whitelist_params.commitment)
            }
            TransferPolicyParams::Permissionless => Self::Permissionless,
        }
    }
}

impl<Hash> Default for TransferPolicy<Hash> {
    fn default() -> Self {
        TransferPolicy::<Hash>::Permissionless
    }
}

#[derive(Encode, Decode, Clone, PartialEq, Eq, Debug, Default)]
pub struct VestingScheduleParams<BlockNumber> {
    // Vesting duration
    pub(crate) duration: BlockNumber,
    // Number of blocks before the linear vesting begins
    pub(crate) blocks_before_cliff: BlockNumber,
    // Initial, instantly vested amount once linear vesting begins (percentage of total amount)
    pub(crate) cliff_amount_percentage: Permill,
}

#[derive(Encode, Decode, Clone, PartialEq, Eq, Debug, Default)]
pub struct VestingSchedule<BlockNumber, Balance> {
    // Block at which the vesting begins
    pub(crate) start_block: BlockNumber,
    // Linear vesting duration
    pub(crate) duration: BlockNumber,
    // Amount instantly vested at "start_block"
    pub(crate) cliff_amount: Balance,
    // Total amount to be vested linearly over "duration" (after "start_block")
    pub(crate) post_cliff_total_amount: Balance,
}

impl<BlockNumber, Balance> VestingSchedule<BlockNumber, Balance>
where
    BlockNumber: Saturating + PartialOrd + Copy,
    Balance: Saturating + Clone + Copy + From<u32> + Unsigned + TryInto<u32> + TryInto<u64> + Ord,
{
    pub(crate) fn from_params(
        init_block: BlockNumber,
        amount: Balance,
        params: VestingScheduleParams<BlockNumber>,
    ) -> Self {
        let cliff_amount = params.cliff_amount_percentage * amount;
        Self {
            start_block: init_block.saturating_add(params.blocks_before_cliff),
            duration: params.duration,
            cliff_amount,
            post_cliff_total_amount: amount.saturating_sub(cliff_amount),
        }
    }

    pub(crate) fn locks<T: Trait<BlockNumber = BlockNumber, Balance = Balance>>(
        &self,
        b: BlockNumber,
    ) -> Balance {
        let end_block = self.start_block.saturating_add(self.duration);
        // Vesting not yet started
        if self.start_block > b {
            return self.total_amount();
        }
        // Vesting period is ongoing
        if end_block > b {
            let remaining_vesting_blocks = end_block.saturating_sub(b);
            let remaining_vesting_percentage = Permill::from_rational_approximation(
                T::BlockNumberToBalance::convert(remaining_vesting_blocks),
                T::BlockNumberToBalance::convert(self.duration),
            );
            return remaining_vesting_percentage * self.post_cliff_total_amount;
        }
        // Vesting period has finished
        Balance::zero()
    }

    pub(crate) fn is_finished(&self, b: BlockNumber) -> bool {
        self.start_block.saturating_add(self.duration) <= b
    }

    pub(crate) fn total_amount(&self) -> Balance {
        self.cliff_amount
            .saturating_add(self.post_cliff_total_amount)
    }
}

#[derive(Encode, Decode, Clone, PartialEq, Eq, Debug)]
pub struct SingleDataObjectUploadParams<JoyBalance> {
    pub object_creation_params: DataObjectCreationParameters,
    pub expected_data_size_fee: JoyBalance,
}

#[derive(Encode, Decode, Clone, PartialEq, Eq, Debug)]
pub struct UploadContext<AccountId, BagId> {
    pub uploader_account: AccountId,
    pub bag_id: BagId,
}

#[derive(Encode, Decode, Clone, PartialEq, Eq, Debug)]
pub struct WhitelistParams<Hash, SingleDataObjectUploadParams> {
    /// Whitelist merkle root
    pub commitment: Hash,
    /// Optional payload data to upload to storage
    pub payload: Option<SingleDataObjectUploadParams>,
}

#[derive(Encode, Decode, Clone, PartialEq, Eq, Debug)]
pub struct TokenSaleParams<JoyBalance, Balance, BlockNumber, VestingScheduleParams, AccountId> {
    /// Account that acts as the source of the tokens on sale
    pub tokens_source: AccountId,
    /// Token's unit price in JOY
    pub unit_price: JoyBalance,
    /// Number of tokens on sale
    pub upper_bound_quantity: Balance,
    /// Optional block in the future when the sale should start (by default: starts immediately)
    pub starts_at: Option<BlockNumber>,
    /// Sale duration in blocks
    pub duration: BlockNumber,
    /// Optional vesting schedule for all tokens on sale
    pub vesting_schedule: Option<VestingScheduleParams>,
    /// Optional total sale purchase amount cap per member
    pub cap_per_member: Option<Balance>,
    /// Optional sale metadata
    pub metadata: Option<Vec<u8>>,
}

#[derive(Encode, Decode, Clone, PartialEq, Eq, Debug, Default)]
pub struct TokenSale<JoyBalance, Balance, BlockNumber, VestingScheduleParams, AccountId> {
    /// Token's unit price in JOY
    pub unit_price: JoyBalance,
    /// Number of tokens still on sale (if any)
    pub quantity_left: Balance,
    /// Account that acts as the source of the tokens on sale
    pub tokens_source: AccountId,
    /// Block at which the sale started / will start
    pub start_block: BlockNumber,
    /// Sale duration (in blocks)
    pub duration: BlockNumber,
    /// Optional vesting schedule for all tokens on sale
    pub vesting_schedule: Option<VestingScheduleParams>,
    /// Optional total sale purchase amount cap per member
    pub cap_per_member: Option<Balance>,
}

impl<JoyBalance, Balance, BlockNumber, AccountId>
    TokenSale<JoyBalance, Balance, BlockNumber, VestingScheduleParams<BlockNumber>, AccountId>
where
    BlockNumber: Saturating + Zero + Copy + Clone + PartialOrd,
    Balance: Saturating + Clone + Copy + From<u32> + Unsigned + TryInto<u32> + TryInto<u64> + Ord,
{
    pub(crate) fn try_from_params<T: Trait>(
        params: TokenSaleParamsOf<T>,
    ) -> Result<TokenSaleOf<T>, DispatchError> {
        let current_block = <frame_system::Module<T>>::block_number();
        let start_block = params.starts_at.unwrap_or(current_block);

        ensure!(
            start_block >= current_block,
            Error::<T>::SaleStartingBlockInThePast
        );

        Ok(TokenSale {
            start_block,
            duration: params.duration,
            unit_price: params.unit_price,
            quantity_left: params.upper_bound_quantity,
            vesting_schedule: params.vesting_schedule,
            tokens_source: params.tokens_source,
            cap_per_member: params.cap_per_member,
        })
    }

    pub(crate) fn get_vesting_schedule(
        &self,
        amount: Balance,
    ) -> VestingSchedule<BlockNumber, Balance> {
        self.vesting_schedule.as_ref().map_or(
            // Default VestingSchedule when none specified (distribute all tokens right after sale ends)
            VestingSchedule::<BlockNumber, Balance> {
                start_block: self.start_block.saturating_add(self.duration),
                cliff_amount: amount,
                post_cliff_total_amount: Balance::zero(),
                duration: BlockNumber::zero(),
            },
            |vs| {
                VestingSchedule::<BlockNumber, Balance>::from_params(
                    self.start_block.saturating_add(self.duration),
                    amount,
                    vs.clone(),
                )
            },
        )
    }
}

/// Represents token's offering state
#[derive(Encode, Decode, Clone, PartialEq, Eq, Debug)]
pub enum OfferingState<TokenSale> {
    /// Idle state
    Idle,

    /// Upcoming sale state
    UpcomingSale(TokenSale),

    /// Active sale state
    Sale(TokenSale),

    /// state for IBCO, it might get decorated with the JOY reserve
    /// amount for the token
    BondingCurve,
}

impl<TokenSale> OfferingState<TokenSale> {
    pub(crate) fn of<T: crate::Trait>(token: &TokenDataOf<T>) -> OfferingStateOf<T> {
        token
            .last_sale
            .as_ref()
            .map_or(OfferingStateOf::<T>::Idle, |sale| {
                let current_block = <frame_system::Module<T>>::block_number();
                if current_block < sale.start_block {
                    OfferingStateOf::<T>::UpcomingSale(sale.clone())
                } else if current_block >= sale.start_block
                    && current_block < sale.start_block.saturating_add(sale.duration)
                {
                    OfferingStateOf::<T>::Sale(sale.clone())
                } else {
                    OfferingStateOf::<T>::Idle
                }
            })
    }

    pub(crate) fn ensure_idle_of<T: crate::Trait>(token: &TokenDataOf<T>) -> DispatchResult {
        match Self::of::<T>(&token) {
            OfferingStateOf::<T>::Idle => Ok(()),
            _ => Err(Error::<T>::TokenIssuanceNotInIdleState.into()),
        }
    }

    pub(crate) fn ensure_upcoming_sale_of<T: crate::Trait>(
        token: &TokenDataOf<T>,
    ) -> Result<TokenSaleOf<T>, DispatchError> {
        match Self::of::<T>(&token) {
            OfferingStateOf::<T>::UpcomingSale(sale) => Ok(sale),
            _ => Err(Error::<T>::NoUpcomingSale.into()),
        }
    }

    pub(crate) fn ensure_sale_of<T: crate::Trait>(
        token: &TokenDataOf<T>,
    ) -> Result<TokenSaleOf<T>, DispatchError> {
        match Self::of::<T>(&token) {
            OfferingStateOf::<T>::Sale(sale) => Ok(sale),
            _ => Err(Error::<T>::NoActiveSale.into()),
        }
    }
}

#[derive(Encode, Decode, Clone, PartialEq, Eq, PartialOrd, Ord, Debug)]
pub struct TokenAllocation<Balance, VestingScheduleParams> {
    pub(crate) amount: Balance,
    pub(crate) vesting_schedule: Option<VestingScheduleParams>,
}

/// Input parameters for token issuance
#[derive(Encode, Decode, Clone, PartialEq, Eq, Default, Debug)]
pub struct TokenIssuanceParameters<Hash, TokenAllocation, TransferPolicyParams, AddressId: Ord> {
    /// Initial allocation of the token
    pub(crate) initial_allocation: BTreeMap<AddressId, TokenAllocation>,

    /// Token Symbol
    pub(crate) symbol: Hash,

    /// Initial transfer policy:
    pub(crate) transfer_policy: TransferPolicyParams,

    /// Initial Patronage rate
    pub(crate) patronage_rate: YearlyRate,
}

impl<Hash, AddressId, Balance, VestingScheduleParams, SingleDataObjectUploadParams>
    TokenIssuanceParameters<
        Hash,
        TokenAllocation<Balance, VestingScheduleParams>,
        TransferPolicyParams<WhitelistParams<Hash, SingleDataObjectUploadParams>>,
        AddressId,
    >
where
    AddressId: Ord,
    Balance: Sum + Copy,
    SingleDataObjectUploadParams: Clone,
{
    pub(crate) fn get_initial_allocation_bloat_bond<JoyBalance: From<u32> + Saturating>(
        &self,
        bloat_bond: JoyBalance,
    ) -> JoyBalance {
        let accounts_len = self.initial_allocation.len() as u32;
        bloat_bond.saturating_mul(accounts_len.into())
    }

    pub(crate) fn get_whitelist_payload(&self) -> Option<SingleDataObjectUploadParams> {
        match &self.transfer_policy {
            TransferPolicyParams::Permissioned(whitelist_params) => {
                whitelist_params.payload.clone()
            }
            _ => None,
        }
    }
}

/// Utility enum used in merkle proof verification
#[derive(Encode, Decode, Clone, PartialEq, Eq, Debug, Copy)]
pub enum MerkleSide {
    /// This element appended to the right of the subtree hash
    Right,

    /// This element appended to the left of the subtree hash
    Left,
}

/// Yearly rate used for patronage info initialization
#[derive(Encode, Decode, Clone, PartialEq, Eq, Debug, Copy, Default)]
pub struct YearlyRate(pub Permill);

/// Block rate used for patronage accounting
#[derive(Encode, Decode, Clone, PartialEq, Eq, Debug, Copy, PartialOrd, Default)]
pub struct BlockRate(pub Perquintill);

/// Wrapper around a merkle proof path
#[derive(Encode, Decode, Clone, PartialEq, Eq, Debug)]
pub struct MerkleProof<Hasher: Hash>(pub Vec<(Hasher::Output, MerkleSide)>);

/// Information about a payment
#[derive(Encode, Decode, Clone, PartialEq, Eq, Debug)]
pub struct Payment<Balance> {
    /// Ignored by runtime
    pub remark: Vec<u8>,

    /// Amount
    pub amount: Balance,
}

/// Wrapper around BTreeMap<AccountId, Payment<Balance>>
#[derive(Encode, Decode, Clone, PartialEq, Eq, Debug)]
pub struct Transfers<AccountId, Balance>(pub BTreeMap<AccountId, Payment<Balance>>);

/// Default trait for Merkle Side
impl Default for MerkleSide {
    fn default() -> Self {
        MerkleSide::Right
    }
}

/// Utility wrapper around existing/non existing accounts to be used with transfer etc..
#[derive(Encode, Decode, PartialEq, Eq, Debug, PartialOrd, Ord, Clone)]
pub enum Validated<AccountId: Ord + Eq + Clone> {
    /// Existing account
    Existing(AccountId),

    /// Non Existing account
    NonExisting(AccountId),
}

// implementation

/// Default trait for OfferingState
impl<TokenSale> Default for OfferingState<TokenSale> {
    fn default() -> Self {
        OfferingState::Idle
    }
}

/// Default trait for InitialAllocation
impl<Balance: Zero, VestingScheduleParams> Default
    for TokenAllocation<Balance, VestingScheduleParams>
{
    fn default() -> Self {
        TokenAllocation {
            amount: Balance::zero(),
            vesting_schedule: None,
        }
    }
}

/// Default trait for AccountData
impl<VestingSchedule, Balance: Zero, StakingStatus, JoyBalance: Zero> Default
    for AccountData<VestingSchedule, Balance, StakingStatus, JoyBalance>
{
    fn default() -> Self {
        Self {
            vesting_schedules: BTreeMap::new(),
            split_staking_status: None,
            amount: Balance::zero(),
            bloat_bond: JoyBalance::zero(),
        }
    }
}

impl<Balance, BlockNumber, JoyBalance>
    AccountData<VestingSchedule<BlockNumber, Balance>, Balance, StakingStatus<Balance>, JoyBalance>
where
    Balance: Clone
        + Zero
        + From<u32>
        + TryInto<u32>
        + Unsigned
        + Saturating
        + Sum
        + PartialOrd
        + Ord
        + TryInto<u64>
        + Copy,
    BlockNumber: Copy + Clone + PartialOrd + Ord + Saturating + From<u32> + Unsigned,
    JoyBalance: Zero,
{
    /// Ctor
    pub fn new_with_amount_and_bond(amount: Balance, bloat_bond: JoyBalance) -> Self {
        Self {
            amount,
            bloat_bond,
            ..Self::default()
        }
    }

    pub fn new_with_vesting_and_bond(
        source: VestingSource,
        schedule: VestingSchedule<BlockNumber, Balance>,
        bloat_bond: JoyBalance,
    ) -> Self {
        Self {
            amount: schedule.total_amount(),
            vesting_schedules: [(source, schedule)].iter().cloned().collect(),
            bloat_bond,
            split_staking_status: None,
        }
    }

    /// Check whether an account is empty
    pub(crate) fn is_empty(&self) -> bool {
        self.amount.is_zero()
    }

    /// Calculate account's unvested balance at block `b`
    pub(crate) fn unvested<T: Trait<Balance = Balance, BlockNumber = BlockNumber>>(
        &self,
        b: BlockNumber,
    ) -> Balance {
        self.vesting_schedules
            .values()
            .map(|vs| vs.locks::<T>(b))
            .sum()
    }

    /// Calculate account's staked balance at block `b`
    pub(crate) fn staked<T: Trait<Balance = Balance, BlockNumber = BlockNumber>>(
        &self,
        b: BlockNumber,
    ) -> Balance {
        self.split_staking_status
            .as_ref()
            .map_or(Balance::zero(), |s| s.locks(b))
    }

    /// Calculate account's transferrable balance at block `b`
    pub(crate) fn transferrable<T: Trait<Balance = Balance, BlockNumber = BlockNumber>>(
        &self,
        b: BlockNumber,
    ) -> Balance {
        self.amount
            .saturating_sub(max(self.unvested::<T>(b), self.staked::<T>(b)))
    }

    pub(crate) fn ensure_can_add_or_update_vesting_schedule<
        T: Trait<Balance = Balance, BlockNumber = BlockNumber>,
    >(
        &self,
        b: BlockNumber,
        source: VestingSource,
    ) -> Result<Option<VestingSource>, DispatchError> {
        let new_entry_required = !self.vesting_schedules.contains_key(&source);
        let cleanup_required =
            self.vesting_schedules.len() == T::MaxVestingBalancesPerAccountPerToken::get() as usize;
        let cleanup_candidate = self
            .vesting_schedules
            .iter()
            .find(|(_, schedule)| schedule.is_finished(b))
            .map(|(key, _)| key.clone());

        if new_entry_required && cleanup_required && cleanup_candidate.is_none() {
            return Err(Error::<T>::MaxVestingSchedulesPerAccountPerTokenReached.into());
        }

        if cleanup_required {
            Ok(cleanup_candidate)
        } else {
            Ok(None)
        }
    }

    pub(crate) fn add_or_update_vesting_schedule(
        &mut self,
        source: VestingSource,
        new_schedule: VestingSchedule<BlockNumber, Balance>,
        cleanup_candidate: Option<VestingSource>,
    ) {
        let existing_schedule = self.vesting_schedules.get_mut(&source);

        if let Some(vs) = existing_schedule {
            // Update existing schedule - increase amounts
            vs.cliff_amount = vs.cliff_amount.saturating_add(new_schedule.cliff_amount);
            vs.post_cliff_total_amount = vs
                .post_cliff_total_amount
                .saturating_add(new_schedule.post_cliff_total_amount);
        } else {
            // Perform cleanup if needed
            if let Some(key) = cleanup_candidate {
                self.vesting_schedules.remove(&key);
            }

            // Insert new vesting schedule
            self.vesting_schedules.insert(source, new_schedule.clone());
        }

        self.increase_amount_by(new_schedule.total_amount());
    }

    /// Increase account's total tokens amount by given amount
    pub(crate) fn increase_amount_by(&mut self, amount: Balance) {
        self.amount = self.amount.saturating_add(amount);
    }

    /// Decrease account's total tokens amount by given amount
    pub(crate) fn decrease_amount_by(&mut self, amount: Balance) {
        self.amount = self.amount.saturating_sub(amount);
    }

    /// Ensure that given amount of tokens can be transferred from the account at block `b`
    pub(crate) fn ensure_can_transfer<T: Trait<Balance = Balance, BlockNumber = BlockNumber>>(
        &self,
        b: BlockNumber,
        amount: Balance,
    ) -> DispatchResult {
        ensure!(
            self.transferrable::<T>(b) >= amount,
            crate::Error::<T>::InsufficientTransferrableBalance,
        );
        Ok(())
    }
}
/// Token Data implementation
impl<JoyBalance, Balance, Hash, BlockNumber, VestingScheduleParams, AccountId>
    TokenData<
        Balance,
        Hash,
        BlockNumber,
        TokenSale<JoyBalance, Balance, BlockNumber, VestingScheduleParams, AccountId>,
        RevenueSplitState<JoyBalance, BlockNumber>,
    >
where
    Balance: Zero + Copy + Saturating + Debug + From<u64> + UniqueSaturatedInto<u64> + Unsigned,
    BlockNumber: PartialOrd + Saturating + Copy + AtLeast32BitUnsigned,
{
    // increase total issuance
    pub(crate) fn increase_supply_by(&mut self, amount: Balance) {
        self.tokens_issued = self.tokens_issued.saturating_add(amount);
        self.total_supply = self.total_supply.saturating_add(amount);
    }

    // decrease total issuance (use when tokens are burned for any reason)
    pub(crate) fn decrease_supply_by(&mut self, amount: Balance) {
        self.total_supply = self.total_supply.saturating_sub(amount);
    }

    // increment account number
    pub(crate) fn increment_accounts_number(&mut self) {
        self.accounts_number = self.accounts_number.saturating_add(1u64);
    }

    // decrement account number
    pub(crate) fn decrement_accounts_number(&mut self) {
        self.accounts_number = self.accounts_number.saturating_sub(1u64);
    }

    pub fn set_unclaimed_tally_patronage_at_block(&mut self, amount: Balance, block: BlockNumber) {
        self.patronage_info.last_unclaimed_patronage_tally_block = block;
        self.patronage_info.unclaimed_patronage_tally_amount = amount;
    }

    /// Computes: period * rate * supply + tally
    pub(crate) fn unclaimed_patronage_at_block(&self, block: BlockNumber) -> Balance {
        let blocks = block.saturating_sub(self.patronage_info.last_unclaimed_patronage_tally_block);
        let unclaimed_patronage_percent = self.patronage_info.rate.for_period(blocks);
        unclaimed_patronage_percent
            .mul_floor(self.total_supply)
            .saturating_add(self.patronage_info.unclaimed_patronage_tally_amount)
    }

    pub fn set_new_patronage_rate_at_block(&mut self, new_rate: BlockRate, block: BlockNumber) {
        // update tally according to old rate
        self.patronage_info.unclaimed_patronage_tally_amount =
            self.unclaimed_patronage_at_block(block);
        self.patronage_info.last_unclaimed_patronage_tally_block = block;
        self.patronage_info.rate = new_rate;
    }

    // Returns number of tokens that remain unpurchased & reserved in the the sale's
    // `tokens_source` account (if any)
    pub(crate) fn last_sale_remaining_tokens(&self) -> Balance {
        self.last_sale
            .as_ref()
            .map_or(Balance::zero(), |last_sale| last_sale.quantity_left)
    }

    pub(crate) fn activate_new_revenue_split(
        &mut self,
        allocation: JoyBalance,
        timeline: Timeline<BlockNumber>,
    ) {
        self.revenue_split.activate(allocation, timeline);
        self.latest_revenue_split_id = self
            .latest_revenue_split_id
            .saturating_add(RevenueSplitId::one());
    }

    pub(crate) fn deactivate_revenue_split(&mut self) {
        self.revenue_split.deactivate()
    }

    pub(crate) fn from_params<T: crate::Trait>(
        params: TokenIssuanceParametersOf<T>,
    ) -> TokenDataOf<T> {
        let current_block = <frame_system::Module<T>>::block_number();

        let patronage_info =
            PatronageData::<<T as Trait>::Balance, <T as frame_system::Trait>::BlockNumber> {
                last_unclaimed_patronage_tally_block: current_block,
                unclaimed_patronage_tally_amount: <T as Trait>::Balance::zero(),
                rate: BlockRate::from_yearly_rate(params.patronage_rate, T::BlocksPerYear::get()),
            };

        let total_supply = params
            .initial_allocation
            .iter()
            .map(|(_, v)| v.amount)
            .sum();

        TokenData {
            symbol: params.symbol,
            total_supply,
            tokens_issued: total_supply,
            last_sale: None,
            transfer_policy: params.transfer_policy.into(),
            patronage_info,
            sales_initialized: 0,
            accounts_number: 0,
            revenue_split: RevenueSplitState::Inactive,
            latest_revenue_split_id: 0,
        }
    }
}

impl<Hasher: Hash> MerkleProof<Hasher> {
    pub(crate) fn verify<T, S>(&self, data: &S, commit: Hasher::Output) -> DispatchResult
    where
        T: crate::Trait,
        S: Encode,
    {
        let init = Hasher::hash_of(data);
        let proof_result = self.0.iter().fold(init, |acc, (hash, side)| match side {
            MerkleSide::Left => Hasher::hash_of(&(hash, acc)),
            MerkleSide::Right => Hasher::hash_of(&(acc, hash)),
        });

        ensure!(
            proof_result == commit,
            crate::Error::<T>::MerkleProofVerificationFailure,
        );

        Ok(())
    }
}

impl<AccountId, Balance: Sum + Copy> Transfers<AccountId, Balance> {
    pub fn len(&self) -> usize {
        self.0.len()
    }

    pub fn total_amount(&self) -> Balance {
        self.0.iter().map(|(_, payment)| payment.amount).sum()
    }

    pub fn iter(&self) -> Iter<'_, AccountId, Payment<Balance>> {
        self.0.iter()
    }

    pub fn into_iter(self) -> IntoIter<AccountId, Payment<Balance>> {
        self.0.into_iter()
    }
}

impl<AccountId, Balance> From<Transfers<AccountId, Balance>>
    for BTreeMap<AccountId, Payment<Balance>>
{
    fn from(v: Transfers<AccountId, Balance>) -> Self {
        v.0
    }
}

/// Block Rate bare minimum impementation
impl BlockRate {
    pub fn from_yearly_rate(r: YearlyRate, blocks_per_year: u32) -> Self {
        let max_accuracy: u64 = <Permill as PerThing>::ACCURACY.into();
        BlockRate(Perquintill::from_rational_approximation(
            r.0.deconstruct().into(),
            max_accuracy.saturating_mul(blocks_per_year.into()),
        ))
    }

    pub fn to_yearly_rate_representation(self, blocks_per_year: u32) -> Perquintill {
        self.for_period(blocks_per_year)
    }

    pub fn for_period<BlockNumber>(self, blocks: BlockNumber) -> Perquintill
    where
        BlockNumber: AtLeast32BitUnsigned + Clone,
    {
        Perquintill::from_parts(self.0.deconstruct().saturating_mul(blocks.saturated_into()))
    }

    pub fn saturating_sub(self, other: Self) -> Self {
        BlockRate(self.0.saturating_sub(other.0))
    }
}

// ------ Aliases ---------------------------------------------

/// Creator token balance
pub(crate) type TokenBalanceOf<T> = <T as Trait>::Balance;

/// JOY balance
pub(crate) type JoyBalanceOf<T> = <T as balances::Trait>::Balance;

/// JOY balances module
pub(crate) type Joy<T> = balances::Module<T>;

/// Alias for Staking Status
pub(crate) type StakingStatusOf<T> = StakingStatus<<T as Trait>::Balance>;

/// Alias for Account Data
pub(crate) type AccountDataOf<T> =
    AccountData<VestingScheduleOf<T>, TokenBalanceOf<T>, StakingStatusOf<T>, JoyBalanceOf<T>>;

/// Alias for Token Data
pub(crate) type TokenDataOf<T> = TokenData<
    TokenBalanceOf<T>,
    <T as frame_system::Trait>::Hash,
    <T as frame_system::Trait>::BlockNumber,
    TokenSaleOf<T>,
    RevenueSplitStateOf<T>,
>;

/// Alias for InitialAllocation
pub(crate) type TokenAllocationOf<T> =
    TokenAllocation<TokenBalanceOf<T>, VestingScheduleParamsOf<T>>;

/// Alias for Token Issuance Parameters
pub(crate) type TokenIssuanceParametersOf<T> = TokenIssuanceParameters<
    <T as frame_system::Trait>::Hash,
    TokenAllocationOf<T>,
    TransferPolicyParamsOf<T>,
    <T as frame_system::Trait>::AccountId,
>;

/// Alias for TransferPolicyParams
pub(crate) type TransferPolicyParamsOf<T> = TransferPolicyParams<WhitelistParamsOf<T>>;

/// Alias for TransferPolicy
pub(crate) type TransferPolicyOf<T> = TransferPolicy<<T as frame_system::Trait>::Hash>;

/// Alias for the Merkle Proof type
pub(crate) type MerkleProofOf<T> = MerkleProof<<T as frame_system::Trait>::Hashing>;

/// Alias for VestingScheduleParams
pub(crate) type VestingScheduleParamsOf<T> =
    VestingScheduleParams<<T as frame_system::Trait>::BlockNumber>;

/// Alias for VestingSchedule
pub(crate) type VestingScheduleOf<T> =
    VestingSchedule<<T as frame_system::Trait>::BlockNumber, TokenBalanceOf<T>>;

/// Alias for SingleDataObjectUploadParams
pub(crate) type SingleDataObjectUploadParamsOf<T> = SingleDataObjectUploadParams<JoyBalanceOf<T>>;

/// Alias for WhitelistParams
pub(crate) type WhitelistParamsOf<T> =
    WhitelistParams<<T as frame_system::Trait>::Hash, SingleDataObjectUploadParamsOf<T>>;

/// Alias for TokenSaleParams
pub(crate) type TokenSaleParamsOf<T> = TokenSaleParams<
    JoyBalanceOf<T>,
    TokenBalanceOf<T>,
    <T as frame_system::Trait>::BlockNumber,
    VestingScheduleParamsOf<T>,
    <T as frame_system::Trait>::AccountId,
>;

/// Alias for TokenSale
pub(crate) type TokenSaleOf<T> = TokenSale<
    JoyBalanceOf<T>,
    TokenBalanceOf<T>,
    <T as frame_system::Trait>::BlockNumber,
    VestingScheduleParamsOf<T>,
    <T as frame_system::Trait>::AccountId,
>;

/// Alias for OfferingState
pub(crate) type OfferingStateOf<T> = OfferingState<TokenSaleOf<T>>;

/// Alias for UploadContext
pub(crate) type UploadContextOf<T> = UploadContext<<T as frame_system::Trait>::AccountId, BagId<T>>;

/// TokenSaleId
pub(crate) type TokenSaleId = u32;

/// RevenueSplitId
pub(crate) type RevenueSplitId = u32;

/// Alias for Transfers
pub(crate) type TransfersOf<T> =
    Transfers<<T as frame_system::Trait>::AccountId, TokenBalanceOf<T>>;

/// Validated transfers
pub(crate) type ValidatedTransfers<T> =
    Transfers<Validated<<T as frame_system::Trait>::AccountId>, TokenBalanceOf<T>>;

/// Alias for Timeline
pub type TimelineOf<T> = Timeline<<T as frame_system::Trait>::BlockNumber>;

/// Alias for Revenue Split State
pub type RevenueSplitStateOf<T> =
    RevenueSplitState<JoyBalanceOf<T>, <T as frame_system::Trait>::BlockNumber>;
