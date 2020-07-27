import BN from 'bn.js'
import { assert } from 'chai'
import { ApiWrapper, WorkingGroups } from '../../../utils/apiWrapper'
import { KeyringPair } from '@polkadot/keyring/types'
import { Balance, Event } from '@polkadot/types/interfaces'
import { Keyring } from '@polkadot/api'
import { v4 as uuid } from 'uuid'
import { RewardRelationship } from '@nicaea/types/recurring-rewards'
import { Worker, ApplicationIdToWorkerIdMap, Application } from '@nicaea/types/working-group'
import { Utils } from '../../../utils/utils'
import { Opening as HiringOpening } from '@nicaea/types/hiring'
import { WorkingGroupOpening } from '../../../dto/workingGroupOpening'
import { Fixture } from '../../../utils/fixture'

export class AddWorkerOpeningFixture implements Fixture {
  private apiWrapper: ApiWrapper
  private membersKeyPairs: KeyringPair[]
  private lead: KeyringPair
  private sudo: KeyringPair
  private applicationStake: BN
  private roleStake: BN
  private activationDelay: BN
  private unstakingPeriod: BN
  private module: WorkingGroups

  private result: BN | undefined

  public getResult(): BN | undefined {
    return this.result
  }

  public constructor(
    apiWrapper: ApiWrapper,
    membersKeyPairs: KeyringPair[],
    lead: KeyringPair,
    sudo: KeyringPair,
    applicationStake: BN,
    roleStake: BN,
    activationDelay: BN,
    unstakingPeriod: BN,
    module: WorkingGroups
  ) {
    this.apiWrapper = apiWrapper
    this.membersKeyPairs = membersKeyPairs
    this.lead = lead
    this.sudo = sudo
    this.applicationStake = applicationStake
    this.roleStake = roleStake
    this.activationDelay = activationDelay
    this.unstakingPeriod = unstakingPeriod
    this.module = module
  }

  public async runner(expectFailure: boolean): Promise<void> {
    // Worker opening construction
    const activateAtBlock: BN | undefined = this.activationDelay.eqn(0)
      ? undefined
      : (await this.apiWrapper.getBestBlock()).add(this.activationDelay)
    const opening = new WorkingGroupOpening()
      .setActivateAtBlock(activateAtBlock)
      .setMaxActiveApplicants(new BN(this.membersKeyPairs.length))
      .setMaxReviewPeriodLength(new BN(32))
      .setApplicationStakingPolicyAmount(new BN(this.applicationStake))
      .setApplicationCrowdedOutUnstakingPeriodLength(new BN(1))
      .setApplicationExpiredUnstakingPeriodLength(new BN(1))
      .setRoleStakingPolicyAmount(new BN(this.roleStake))
      .setRoleCrowdedOutUnstakingPeriodLength(new BN(1))
      .setRoleExpiredUnstakingPeriodLength(new BN(1))
      .setSlashableMaxCount(new BN(1))
      .setSlashableMaxPercentPtsPerTime(new BN(100))
      .setSuccessfulApplicantApplicationStakeUnstakingPeriod(this.unstakingPeriod)
      .setFailedApplicantApplicationStakeUnstakingPeriod(this.unstakingPeriod)
      .setFailedApplicantRoleStakeUnstakingPeriod(this.unstakingPeriod)
      .setTerminateApplicationStakeUnstakingPeriod(this.unstakingPeriod)
      .setTerminateRoleStakeUnstakingPeriod(this.unstakingPeriod)
      .setExitRoleApplicationStakeUnstakingPeriod(this.unstakingPeriod)
      .setExitRoleStakeUnstakingPeriod(this.unstakingPeriod)
      .setText(uuid().substring(0, 8))
      .setOpeningType('Worker')

    // Fee estimation and transfer
    const addOpeningFee: BN = this.apiWrapper.estimateAddOpeningFee(opening, this.module)
    await this.apiWrapper.transferBalance(this.sudo, this.lead.address, addOpeningFee)

    // Worker opening creation
    const addOpeningPromise: Promise<BN> = this.apiWrapper.expectOpeningAdded()
    await this.apiWrapper.addOpening(this.lead, opening, this.module, expectFailure)
    if (!expectFailure) {
      const openingId: BN = await addOpeningPromise
      this.result = openingId
    }
  }
}

export class AddLeaderOpeningFixture implements Fixture {
  private apiWrapper: ApiWrapper
  private membersKeyPairs: KeyringPair[]
  private sudo: KeyringPair
  private applicationStake: BN
  private roleStake: BN
  private activationDelay: BN
  private module: WorkingGroups

  private result: BN | undefined

  public getResult(): BN | undefined {
    return this.result
  }

  public constructor(
    apiWrapper: ApiWrapper,
    membersKeyPairs: KeyringPair[],
    sudo: KeyringPair,
    applicationStake: BN,
    roleStake: BN,
    activationDelay: BN,
    module: WorkingGroups
  ) {
    this.apiWrapper = apiWrapper
    this.membersKeyPairs = membersKeyPairs
    this.sudo = sudo
    this.applicationStake = applicationStake
    this.roleStake = roleStake
    this.activationDelay = activationDelay
    this.module = module
  }

  public async runner(expectFailure: boolean): Promise<void> {
    // Leader opening creation
    const activateAtBlock: BN | undefined = this.activationDelay.eqn(0)
      ? undefined
      : (await this.apiWrapper.getBestBlock()).add(this.activationDelay)
    const opening = new WorkingGroupOpening()
      .setActivateAtBlock(activateAtBlock)
      .setMaxActiveApplicants(new BN(this.membersKeyPairs.length))
      .setMaxReviewPeriodLength(new BN(32))
      .setApplicationStakingPolicyAmount(new BN(this.applicationStake))
      .setApplicationCrowdedOutUnstakingPeriodLength(new BN(1))
      .setApplicationExpiredUnstakingPeriodLength(new BN(1))
      .setRoleStakingPolicyAmount(new BN(this.roleStake))
      .setRoleCrowdedOutUnstakingPeriodLength(new BN(1))
      .setRoleExpiredUnstakingPeriodLength(new BN(1))
      .setSlashableMaxCount(new BN(1))
      .setSlashableMaxPercentPtsPerTime(new BN(100))
      .setSuccessfulApplicantApplicationStakeUnstakingPeriod(new BN(1))
      .setFailedApplicantApplicationStakeUnstakingPeriod(new BN(1))
      .setFailedApplicantRoleStakeUnstakingPeriod(new BN(1))
      .setTerminateApplicationStakeUnstakingPeriod(new BN(1))
      .setTerminateRoleStakeUnstakingPeriod(new BN(1))
      .setExitRoleApplicationStakeUnstakingPeriod(new BN(1))
      .setExitRoleStakeUnstakingPeriod(new BN(1))
      .setText(uuid().substring(0, 8))
      .setOpeningType('leader')

    const addOpeningPromise: Promise<BN> = this.apiWrapper.expectOpeningAdded()
    await this.apiWrapper.sudoAddOpening(this.sudo, opening, this.module)
    const openingId: BN = await addOpeningPromise

    this.result = openingId
  }
}

export class AcceptApplicationsFixture implements Fixture {
  private apiWrapper: ApiWrapper
  private lead: KeyringPair
  private sudo: KeyringPair
  private openingId: BN
  private module: WorkingGroups

  public constructor(
    apiWrapper: ApiWrapper,
    lead: KeyringPair,
    sudo: KeyringPair,
    openingId: BN,
    module: WorkingGroups
  ) {
    this.apiWrapper = apiWrapper
    this.lead = lead
    this.sudo = sudo
    this.openingId = openingId
    this.module = module
  }

  public async runner(expectFailure: boolean): Promise<void> {
    // Fee estimation and transfer
    const acceptApplicationsFee = this.apiWrapper.estimateAcceptApplicationsFee(this.module)
    await this.apiWrapper.transferBalance(this.sudo, this.lead.address, acceptApplicationsFee)

    // Begin accepting applications
    await this.apiWrapper.acceptApplications(this.lead, this.openingId, this.module)

    const opening: HiringOpening = await this.apiWrapper.getHiringOpening(this.openingId)
    assert(opening.is_active, `Opening ${this.openingId} is not active`)
  }
}

export class ApplyForOpeningFixture implements Fixture {
  private apiWrapper: ApiWrapper
  private membersKeyPairs: KeyringPair[]
  private sudo: KeyringPair
  private applicationStake: BN
  private roleStake: BN
  private openingId: BN
  private module: WorkingGroups
  private expectFailure: boolean

  public constructor(
    apiWrapper: ApiWrapper,
    membersKeyPairs: KeyringPair[],
    sudo: KeyringPair,
    applicationStake: BN,
    roleStake: BN,
    openingId: BN,
    module: WorkingGroups,
    expectFailure: boolean
  ) {
    this.apiWrapper = apiWrapper
    this.membersKeyPairs = membersKeyPairs
    this.sudo = sudo
    this.applicationStake = applicationStake
    this.roleStake = roleStake
    this.openingId = openingId
    this.module = module
    this.expectFailure = expectFailure
  }

  public async runner(expectFailure: boolean): Promise<void> {
    // Fee estimation and transfer
    const applyOnOpeningFee: BN = this.apiWrapper
      .estimateApplyOnOpeningFee(this.sudo, this.module)
      .add(this.applicationStake)
      .add(this.roleStake)
    await this.apiWrapper.transferBalanceToAccounts(this.sudo, this.membersKeyPairs, applyOnOpeningFee)

    // Applying for created worker opening
    await this.apiWrapper.batchApplyOnOpening(
      this.membersKeyPairs,
      this.openingId,
      this.roleStake,
      this.applicationStake,
      uuid().substring(0, 8),
      this.module,
      this.expectFailure
    )
  }
}

export class WithdrawApplicationFixture implements Fixture {
  private apiWrapper: ApiWrapper
  private membersKeyPairs: KeyringPair[]
  private sudo: KeyringPair
  private module: WorkingGroups

  constructor(apiWrapper: ApiWrapper, membersKeyPairs: KeyringPair[], sudo: KeyringPair, module: WorkingGroups) {
    this.apiWrapper = apiWrapper
    this.membersKeyPairs = membersKeyPairs
    this.sudo = sudo
    this.module = module
  }

  public async runner(expectFailure: boolean): Promise<void> {
    // Fee estimation and transfer
    const withdrawApplicaitonFee: BN = this.apiWrapper.estimateWithdrawApplicationFee(this.module)
    await this.apiWrapper.transferBalanceToAccounts(this.sudo, this.membersKeyPairs, withdrawApplicaitonFee)

    // Application withdrawal
    await this.apiWrapper.batchWithdrawApplication(this.membersKeyPairs, this.module)

    // Assertions
    this.membersKeyPairs.forEach(async (keyPair) => {
      const activeApplications: BN[] = await this.apiWrapper.getActiveApplicationsIdsByRoleAccount(
        keyPair.address,
        this.module
      )
      assert(activeApplications.length === 0, `Unexpected active application found for ${keyPair.address}`)
    })
  }
}

export class BeginApplicationReviewFixture implements Fixture {
  private apiWrapper: ApiWrapper
  private lead: KeyringPair
  private sudo: KeyringPair
  private openingId: BN
  private module: WorkingGroups

  constructor(apiWrapper: ApiWrapper, lead: KeyringPair, sudo: KeyringPair, openingId: BN, module: WorkingGroups) {
    this.apiWrapper = apiWrapper
    this.lead = lead
    this.sudo = sudo
    this.openingId = openingId
    this.module = module
  }

  public async runner(expectFailure: boolean): Promise<void> {
    // Fee estimation and transfer
    const beginReviewFee: BN = this.apiWrapper.estimateBeginApplicantReviewFee(this.module)
    await this.apiWrapper.transferBalance(this.sudo, this.lead.address, beginReviewFee)

    // Begin application review
    const beginApplicantReviewPromise: Promise<BN> = this.apiWrapper.expectApplicationReviewBegan()
    await this.apiWrapper.beginApplicantReview(this.lead, this.openingId, this.module)
    await beginApplicantReviewPromise
  }
}

export class BeginLeaderApplicationReviewFixture implements Fixture {
  private apiWrapper: ApiWrapper
  private sudo: KeyringPair
  private openingId: BN
  private module: WorkingGroups

  constructor(apiWrapper: ApiWrapper, sudo: KeyringPair, openingId: BN, module: WorkingGroups) {
    this.apiWrapper = apiWrapper
    this.sudo = sudo
    this.openingId = openingId
    this.module = module
  }

  public async runner(expectFailure: boolean): Promise<void> {
    // Begin application review
    await this.apiWrapper.sudoBeginApplicantReview(this.sudo, this.openingId, this.module)
  }
}

export class FillOpeningFixture implements Fixture {
  private apiWrapper: ApiWrapper
  private membersKeyPairs: KeyringPair[]
  private lead: KeyringPair
  private sudo: KeyringPair
  private openingId: BN
  private firstPayoutInterval: BN
  private payoutInterval: BN
  private amountPerPayout: BN
  private module: WorkingGroups

  constructor(
    apiWrapper: ApiWrapper,
    membersKeyPairs: KeyringPair[],
    lead: KeyringPair,
    sudo: KeyringPair,
    openingId: BN,
    firstPayoutInterval: BN,
    payoutInterval: BN,
    amountPerPayout: BN,
    module: WorkingGroups
  ) {
    this.apiWrapper = apiWrapper
    this.membersKeyPairs = membersKeyPairs
    this.lead = lead
    this.sudo = sudo
    this.openingId = openingId
    this.firstPayoutInterval = firstPayoutInterval
    this.payoutInterval = payoutInterval
    this.amountPerPayout = amountPerPayout
    this.module = module
  }

  public async runner(expectFailure: boolean): Promise<void> {
    // Fee estimation and transfer
    const beginReviewFee: BN = this.apiWrapper.estimateBeginApplicantReviewFee(this.module)
    await this.apiWrapper.transferBalance(this.sudo, this.lead.address, beginReviewFee)
    const applicationIds: BN[] = (
      await Promise.all(
        this.membersKeyPairs.map(async (keypair) =>
          this.apiWrapper.getActiveApplicationsIdsByRoleAccount(keypair.address, this.module)
        )
      )
    ).flat()

    // Fill worker opening
    const now: BN = await this.apiWrapper.getBestBlock()
    const fillOpeningPromise: Promise<ApplicationIdToWorkerIdMap> = this.apiWrapper.expectOpeningFilled()
    await this.apiWrapper.fillOpening(
      this.lead,
      this.openingId,
      applicationIds,
      this.amountPerPayout,
      now.add(this.firstPayoutInterval),
      this.payoutInterval,
      this.module
    )
    const applicationIdToWorkerIdMap: ApplicationIdToWorkerIdMap = await fillOpeningPromise

    // Assertions
    applicationIdToWorkerIdMap.forEach(async (workerId, applicationId) => {
      const worker: Worker = await this.apiWrapper.getWorkerById(workerId, this.module)
      const application: Application = await this.apiWrapper.getApplicationById(applicationId, this.module)
      assert(
        worker.role_account_id.toString() === application.role_account_id.toString(),
        `Role account ids does not match, worker account: ${worker.role_account_id}, application account ${application.role_account_id}`
      )
    })
    const openingWorkersAccounts: string[] = (await this.apiWrapper.getWorkers(this.module)).map((worker) =>
      worker.role_account_id.toString()
    )
    this.membersKeyPairs.forEach((keyPair) =>
      assert(openingWorkersAccounts.includes(keyPair.address), `Account ${keyPair.address} is not worker`)
    )
  }
}

export class FillLeaderOpeningFixture implements Fixture {
  private apiWrapper: ApiWrapper
  private membersKeyPairs: KeyringPair[]
  private sudo: KeyringPair
  private openingId: BN
  private firstPayoutInterval: BN
  private payoutInterval: BN
  private amountPerPayout: BN
  private module: WorkingGroups

  constructor(
    apiWrapper: ApiWrapper,
    membersKeyPairs: KeyringPair[],
    sudo: KeyringPair,
    openingId: BN,
    firstPayoutInterval: BN,
    payoutInterval: BN,
    amountPerPayout: BN,
    module: WorkingGroups
  ) {
    this.apiWrapper = apiWrapper
    this.membersKeyPairs = membersKeyPairs
    this.sudo = sudo
    this.openingId = openingId
    this.firstPayoutInterval = firstPayoutInterval
    this.payoutInterval = payoutInterval
    this.amountPerPayout = amountPerPayout
    this.module = module
  }

  public async runner(expectFailure: boolean): Promise<void> {
    const applicationIds: BN[] = (
      await Promise.all(
        this.membersKeyPairs.map(async (keypair) =>
          this.apiWrapper.getActiveApplicationsIdsByRoleAccount(keypair.address, this.module)
        )
      )
    ).flat()

    // Fill leader opening
    const now: BN = await this.apiWrapper.getBestBlock()
    const fillOpeningPromise: Promise<ApplicationIdToWorkerIdMap> = this.apiWrapper.expectOpeningFilled()
    await this.apiWrapper.sudoFillOpening(
      this.sudo,
      this.openingId,
      applicationIds,
      this.amountPerPayout,
      now.add(this.firstPayoutInterval),
      this.payoutInterval,
      this.module
    )

    // Assertions
    const applicationIdToWorkerIdMap: ApplicationIdToWorkerIdMap = await fillOpeningPromise
    applicationIdToWorkerIdMap.forEach(async (workerId, applicationId) => {
      const worker: Worker = await this.apiWrapper.getWorkerById(workerId, this.module)
      const application: Application = await this.apiWrapper.getApplicationById(applicationId, this.module)
      assert(
        worker.role_account_id.toString() === application.role_account_id.toString(),
        `Role account ids does not match, leader account: ${worker.role_account_id}, application account ${application.role_account_id}`
      )
    })
    const leadWorkerId: BN = (await this.apiWrapper.getLeadWorkerId(this.module))!
    const openingLeaderAccount: string = (
      await this.apiWrapper.getWorkerById(leadWorkerId, this.module)
    ).role_account_id.toString()
    assert(
      openingLeaderAccount === this.membersKeyPairs[0].address,
      `Unexpected leader account ${openingLeaderAccount}, expected ${this.membersKeyPairs[0].address}`
    )
  }
}

export class IncreaseStakeFixture implements Fixture {
  private apiWrapper: ApiWrapper
  private membersKeyPairs: KeyringPair[]
  private sudo: KeyringPair
  private module: WorkingGroups

  constructor(apiWrapper: ApiWrapper, membersKeyPairs: KeyringPair[], sudo: KeyringPair, module: WorkingGroups) {
    this.apiWrapper = apiWrapper
    this.membersKeyPairs = membersKeyPairs
    this.sudo = sudo
    this.module = module
  }

  public async runner(expectFailure: boolean): Promise<void> {
    // Fee estimation and transfer
    const increaseStakeFee: BN = this.apiWrapper.estimateIncreaseStakeFee(this.module)
    const stakeIncrement: BN = new BN(1)
    await this.apiWrapper.transferBalance(
      this.sudo,
      this.membersKeyPairs[0].address,
      increaseStakeFee.add(stakeIncrement)
    )
    const workerId: BN = await this.apiWrapper.getWorkerIdByRoleAccount(this.membersKeyPairs[0].address, this.module)

    // Increase worker stake
    const increasedWorkerStake: BN = (await this.apiWrapper.getWorkerStakeAmount(workerId, this.module)).add(
      stakeIncrement
    )
    await this.apiWrapper.increaseStake(this.membersKeyPairs[0], workerId, stakeIncrement, this.module)
    const newWorkerStake: BN = await this.apiWrapper.getWorkerStakeAmount(workerId, this.module)
    assert(
      increasedWorkerStake.eq(newWorkerStake),
      `Unexpected worker stake ${newWorkerStake}, expected ${increasedWorkerStake}`
    )
  }
}

export class UpdateRewardAccountFixture implements Fixture {
  public apiWrapper: ApiWrapper
  public membersKeyPairs: KeyringPair[]
  public keyring: Keyring
  public sudo: KeyringPair
  public module: WorkingGroups

  constructor(
    apiWrapper: ApiWrapper,
    membersKeyPairs: KeyringPair[],
    keyring: Keyring,
    sudo: KeyringPair,
    module: WorkingGroups
  ) {
    this.apiWrapper = apiWrapper
    this.membersKeyPairs = membersKeyPairs
    this.keyring = keyring
    this.sudo = sudo
    this.module = module
  }

  public async runner(expectFailure: boolean): Promise<void> {
    // Fee estimation and transfer
    const updateRewardAccountFee: BN = this.apiWrapper.estimateUpdateRewardAccountFee(this.sudo.address, this.module)
    await this.apiWrapper.transferBalance(this.sudo, this.membersKeyPairs[0].address, updateRewardAccountFee)
    const workerId: BN = await this.apiWrapper.getWorkerIdByRoleAccount(this.membersKeyPairs[0].address, this.module)

    // Update reward account
    const createdAccount: KeyringPair = this.keyring.addFromUri(uuid().substring(0, 8))
    await this.apiWrapper.updateRewardAccount(this.membersKeyPairs[0], workerId, createdAccount.address, this.module)
    const newRewardAccount: string = await this.apiWrapper.getWorkerRewardAccount(workerId, this.module)
    assert(
      newRewardAccount === createdAccount.address,
      `Unexpected role account ${newRewardAccount}, expected ${createdAccount.address}`
    )
  }
}

export class UpdateRoleAccountFixture implements Fixture {
  private apiWrapper: ApiWrapper
  private membersKeyPairs: KeyringPair[]
  private keyring: Keyring
  private sudo: KeyringPair
  private module: WorkingGroups

  constructor(
    apiWrapper: ApiWrapper,
    membersKeyPairs: KeyringPair[],
    keyring: Keyring,
    sudo: KeyringPair,
    module: WorkingGroups
  ) {
    this.apiWrapper = apiWrapper
    this.membersKeyPairs = membersKeyPairs
    this.keyring = keyring
    this.sudo = sudo
    this.module = module
  }

  public async runner(expectFailure: boolean): Promise<void> {
    // Fee estimation and transfer
    const updateRoleAccountFee: BN = this.apiWrapper.estimateUpdateRoleAccountFee(this.sudo.address, this.module)
    await this.apiWrapper.transferBalance(this.sudo, this.membersKeyPairs[0].address, updateRoleAccountFee)
    const workerId: BN = await this.apiWrapper.getWorkerIdByRoleAccount(this.membersKeyPairs[0].address, this.module)

    // Update role account
    const createdAccount: KeyringPair = this.keyring.addFromUri(uuid().substring(0, 8))
    await this.apiWrapper.updateRoleAccount(this.membersKeyPairs[0], workerId, createdAccount.address, this.module)
    const newRoleAccount: string = (
      await this.apiWrapper.getWorkerById(workerId, this.module)
    ).role_account_id.toString()
    assert(
      newRoleAccount === createdAccount.address,
      `Unexpected role account ${newRoleAccount}, expected ${createdAccount.address}`
    )

    this.membersKeyPairs[0] = createdAccount
  }
}

export class TerminateApplicationsFixture implements Fixture {
  private apiWrapper: ApiWrapper
  private membersKeyPairs: KeyringPair[]
  private lead: KeyringPair
  private sudo: KeyringPair
  private module: WorkingGroups

  constructor(
    apiWrapper: ApiWrapper,
    membersKeyPairs: KeyringPair[],
    lead: KeyringPair,
    sudo: KeyringPair,
    module: WorkingGroups
  ) {
    this.apiWrapper = apiWrapper
    this.membersKeyPairs = membersKeyPairs
    this.lead = lead
    this.sudo = sudo
    this.module = module
  }

  public async runner(expectFailure: boolean): Promise<void> {
    // Fee estimation and transfer
    const terminateApplicationFee = this.apiWrapper.estimateTerminateApplicationFee(this.module)
    await this.apiWrapper.transferBalance(
      this.sudo,
      this.lead.address,
      terminateApplicationFee.muln(this.membersKeyPairs.length)
    )

    // Terminate worker applications
    await this.apiWrapper.batchTerminateApplication(this.lead, this.membersKeyPairs, this.module)
    this.membersKeyPairs.forEach(async (keyPair) => {
      const activeApplications = await this.apiWrapper.getActiveApplicationsIdsByRoleAccount(
        keyPair.address,
        this.module
      )
      assert(activeApplications.length === 0, `Account ${keyPair.address} has unexpected active applications`)
    })
  }
}

export class DecreaseStakeFixture implements Fixture {
  private apiWrapper: ApiWrapper
  private membersKeyPairs: KeyringPair[]
  private lead: KeyringPair
  private sudo: KeyringPair
  private module: WorkingGroups

  constructor(
    apiWrapper: ApiWrapper,
    membersKeyPairs: KeyringPair[],
    lead: KeyringPair,
    sudo: KeyringPair,
    module: WorkingGroups,
    expectFailure: boolean
  ) {
    this.apiWrapper = apiWrapper
    this.membersKeyPairs = membersKeyPairs
    this.lead = lead
    this.sudo = sudo
    this.module = module
  }

  public async runner(expectFailure: boolean): Promise<void> {
    // Fee estimation and transfer
    const decreaseStakeFee = this.apiWrapper.estimateDecreaseStakeFee(this.module)
    await this.apiWrapper.transferBalance(this.sudo, this.lead.address, decreaseStakeFee)
    const workerStakeDecrement = new BN(1)
    const workerId: BN = await this.apiWrapper.getWorkerIdByRoleAccount(this.membersKeyPairs[0].address, this.module)

    // Worker stake decrement
    const decreasedWorkerStake: BN = (await this.apiWrapper.getWorkerStakeAmount(workerId, this.module)).sub(
      workerStakeDecrement
    )
    await this.apiWrapper.decreaseStake(this.lead, workerId, workerStakeDecrement, this.module, expectFailure)
    const newWorkerStake: BN = await this.apiWrapper.getWorkerStakeAmount(workerId, this.module)

    // Assertions
    if (!expectFailure) {
      assert(
        decreasedWorkerStake.eq(newWorkerStake),
        `Unexpected worker stake ${newWorkerStake}, expected ${decreasedWorkerStake}`
      )
    }
  }
}

export class SlashFixture implements Fixture {
  private apiWrapper: ApiWrapper
  private membersKeyPairs: KeyringPair[]
  private lead: KeyringPair
  private sudo: KeyringPair
  private module: WorkingGroups

  constructor(
    apiWrapper: ApiWrapper,
    membersKeyPairs: KeyringPair[],
    lead: KeyringPair,
    sudo: KeyringPair,
    module: WorkingGroups
  ) {
    this.apiWrapper = apiWrapper
    this.membersKeyPairs = membersKeyPairs
    this.lead = lead
    this.sudo = sudo
    this.module = module
  }

  public async runner(expectFailure: boolean): Promise<void> {
    // Fee estimation and transfer
    const slashStakeFee = this.apiWrapper.estimateSlashStakeFee(this.module)
    await this.apiWrapper.transferBalance(this.sudo, this.lead.address, slashStakeFee)
    const slashAmount = new BN(1)
    const workerId: BN = await this.apiWrapper.getWorkerIdByRoleAccount(this.membersKeyPairs[0].address, this.module)

    // Slash worker
    const slashedStake: BN = (await this.apiWrapper.getWorkerStakeAmount(workerId, this.module)).sub(slashAmount)
    await this.apiWrapper.slashStake(this.lead, workerId, slashAmount, this.module, expectFailure)
    const newStake: BN = await this.apiWrapper.getWorkerStakeAmount(workerId, this.module)

    // Assertions
    assert(slashedStake.eq(newStake), `Unexpected worker stake ${newStake}, expected ${slashedStake}`)
  }
}

export class TerminateRoleFixture implements Fixture {
  private apiWrapper: ApiWrapper
  private membersKeyPairs: KeyringPair[]
  private lead: KeyringPair
  private sudo: KeyringPair
  private module: WorkingGroups

  constructor(
    apiWrapper: ApiWrapper,
    membersKeyPairs: KeyringPair[],
    lead: KeyringPair,
    sudo: KeyringPair,
    module: WorkingGroups
  ) {
    this.apiWrapper = apiWrapper
    this.membersKeyPairs = membersKeyPairs
    this.lead = lead
    this.sudo = sudo
    this.module = module
  }

  public async runner(expectFailure: boolean): Promise<void> {
    // Fee estimation and transfer
    const terminateRoleFee = this.apiWrapper.estimateTerminateRoleFee(this.module)
    await this.apiWrapper.transferBalance(this.sudo, this.lead.address, terminateRoleFee)
    const workerId: BN = await this.apiWrapper.getWorkerIdByRoleAccount(this.membersKeyPairs[0].address, this.module)

    // Slash worker
    await this.apiWrapper.terminateRole(this.lead, workerId, uuid().substring(0, 8), this.module, expectFailure)

    // Assertions
    this.apiWrapper.getWorkerIdByRoleAccount(this.membersKeyPairs[0].address, this.module)
    const newWorkerId = await this.apiWrapper.getWorkerIdByRoleAccount(this.membersKeyPairs[0].address, this.module)
    assert(newWorkerId === undefined, `Worker with account ${this.membersKeyPairs[0].address} is not terminated`)
  }
}

export class LeaveRoleFixture implements Fixture {
  private apiWrapper: ApiWrapper
  private membersKeyPairs: KeyringPair[]
  private sudo: KeyringPair
  private module: WorkingGroups

  constructor(apiWrapper: ApiWrapper, membersKeyPairs: KeyringPair[], sudo: KeyringPair, module: WorkingGroups) {
    this.apiWrapper = apiWrapper
    this.membersKeyPairs = membersKeyPairs
    this.sudo = sudo
    this.module = module
  }

  public async runner(expectFailure: boolean): Promise<void> {
    // Fee estimation and transfer
    const leaveRoleFee = this.apiWrapper.estimateLeaveRoleFee(this.module)
    await this.apiWrapper.transferBalanceToAccounts(this.sudo, this.membersKeyPairs, leaveRoleFee)

    await this.apiWrapper.batchLeaveRole(this.membersKeyPairs, uuid().substring(0, 8), false, this.module)

    // Assertions
    this.membersKeyPairs.forEach(async (keyPair) => {
      this.apiWrapper.getWorkerIdByRoleAccount(keyPair.address, this.module)
      const newWorkerId = await this.apiWrapper.getWorkerIdByRoleAccount(keyPair.address, this.module)
      assert(newWorkerId === undefined, `Worker with account ${keyPair.address} is not terminated`)
    })
  }
}

export class AwaitPayoutFixture implements Fixture {
  private apiWrapper: ApiWrapper
  private membersKeyPairs: KeyringPair[]
  private module: WorkingGroups

  constructor(apiWrapper: ApiWrapper, membersKeyPairs: KeyringPair[], module: WorkingGroups) {
    this.apiWrapper = apiWrapper
    this.membersKeyPairs = membersKeyPairs
    this.module = module
  }

  public async runner(expectFailure: boolean): Promise<void> {
    const workerId: BN = await this.apiWrapper.getWorkerIdByRoleAccount(this.membersKeyPairs[0].address, this.module)
    const worker: Worker = await this.apiWrapper.getWorkerById(workerId, this.module)
    const reward: RewardRelationship = await this.apiWrapper.getRewardRelationship(worker.reward_relationship.unwrap())
    const now: BN = await this.apiWrapper.getBestBlock()
    const nextPaymentBlock: BN = new BN(reward.getField('next_payment_at_block').toString())
    const payoutInterval: BN = new BN(reward.getField('payout_interval').toString())
    const amountPerPayout: BN = new BN(reward.getField('amount_per_payout').toString())

    assert(now.lt(nextPaymentBlock), `Payout already happened in block ${nextPaymentBlock} now ${now}`)
    const balance = await this.apiWrapper.getBalance(this.membersKeyPairs[0].address)

    const firstPayoutWaitingPeriod = nextPaymentBlock.sub(now).addn(1)
    await Utils.wait(this.apiWrapper.getBlockDuration().mul(firstPayoutWaitingPeriod).toNumber())

    const balanceAfterFirstPayout = await this.apiWrapper.getBalance(this.membersKeyPairs[0].address)
    const expectedBalanceFirst = balance.add(amountPerPayout)
    assert(
      balanceAfterFirstPayout.eq(expectedBalanceFirst),
      `Unexpected balance, expected ${expectedBalanceFirst} got ${balanceAfterFirstPayout}`
    )

    const secondPayoutWaitingPeriod = payoutInterval.addn(1)
    await Utils.wait(this.apiWrapper.getBlockDuration().mul(secondPayoutWaitingPeriod).toNumber())

    const balanceAfterSecondPayout = await this.apiWrapper.getBalance(this.membersKeyPairs[0].address)
    const expectedBalanceSecond = expectedBalanceFirst.add(amountPerPayout)
    assert(
      balanceAfterSecondPayout.eq(expectedBalanceSecond),
      `Unexpected balance, expected ${expectedBalanceSecond} got ${balanceAfterSecondPayout}`
    )
  }
}

// export class SetMintCapacityFixture implements Fixture {
//   private apiWrapper: ApiWrapper
//   private sudo: KeyringPair
//   private capacity: BN
//   private module: WorkingGroups
//
//   constructor(apiWrapper: ApiWrapper, sudo: KeyringPair, capacity:, module: WorkingGroups) {
//     this.apiWrapper = apiWrapper;
//     this.sudo = sudo;
//     this.capacity = capacity;
//     this.module = module;
//   }
//
//   public async runner(expectFailure: boolean): Promise<void> {
//     await this.apiWrapper.sudoSetWorkingGroupMintCapacity(this.sudo, this.capacity, this.module)
//   }
//
// }

export class ExpectLeadOpeningAddedFixture implements Fixture {
  private apiWrapper: ApiWrapper

  // Opening id
  private result: BN | undefined
  private events: Event[] = []

  constructor(apiWrapper: ApiWrapper) {
    this.apiWrapper = apiWrapper
  }

  public getResult(): BN | undefined {
    return this.result
  }

  public getEvents(): Event[] {
    return this.events
  }

  public async runner(expectFailure: boolean): Promise<void> {
    const event: Event = await this.apiWrapper.expectEvent('OpeningAdded')
    this.events.push(event)
    this.result = (event.data as unknown) as BN
  }
}

export class ExpectLeaderSetFixture implements Fixture {
  private apiWrapper: ApiWrapper
  private leaderAddress: string
  private module: WorkingGroups

  // Lead worker id
  private result: BN | undefined
  private events: Event[] = []

  constructor(apiWrapper: ApiWrapper, leaderAddress: string, module: WorkingGroups) {
    this.apiWrapper = apiWrapper
    this.leaderAddress = leaderAddress
    this.module = module
  }

  public getResult(): BN | undefined {
    return this.result
  }

  public getEvents(): Event[] {
    return this.events
  }

  public async runner(expectFailure: boolean): Promise<void> {
    const event: Event = await this.apiWrapper.expectEvent('LeaderSet')
    this.events.push(event)
    const leadWorkerId: BN = (event.data as unknown) as BN
    const worker: Worker = await this.apiWrapper.getWorkerById(leadWorkerId, this.module)
    const leaderApplicationId = (
      await this.apiWrapper.getApplicationsIdsByRoleAccount(this.leaderAddress, this.module)
    )[0]
    const application: Application = await this.apiWrapper.getApplicationById(leaderApplicationId, this.module)
    assert(
      worker.role_account_id.eq(application.role_account_id),
      `Role account ids does not match, leader account: ${worker.role_account_id}, application account ${application.role_account_id}`
    )
    this.result = leadWorkerId
  }
}

export class ExpectBeganApplicationReview implements Fixture {
  private apiWrapper: ApiWrapper

  private result: BN | undefined
  private events: Event[] = []

  constructor(apiWrapper: ApiWrapper) {
    this.apiWrapper = apiWrapper
  }

  public getResult(): BN | undefined {
    return this.result
  }

  public getEvents(): Event[] {
    return this.events
  }

  public async runner(expectFailure: boolean): Promise<void> {
    const event: Event = await this.apiWrapper.expectEvent('BeganApplicationReview')
    this.events.push(event)
    this.result = (event.data as unknown) as BN
  }
}

export class ExpectLeaderRoleTerminatedFixture implements Fixture {
  private apiWrapper: ApiWrapper
  private module: WorkingGroups

  private result: BN | undefined
  private events: Event[] = []

  constructor(apiWrapper: ApiWrapper, module: WorkingGroups) {
    this.apiWrapper = apiWrapper
    this.module = module
  }

  public getResult(): BN | undefined {
    return this.result
  }

  public getEvents(): Event[] {
    return this.events
  }

  public async runner(expectFailure: boolean): Promise<void> {
    const event: Event = await this.apiWrapper.expectEvent('TerminatedLeader')
    this.events.push(event)
    const leadWorkerId: BN | undefined = await this.apiWrapper.getLeadWorkerId(this.module)
    assert(leadWorkerId === undefined, `Unexpected lead worker id: ${leadWorkerId}, expected none`)
  }
}

export class ExpectLeaderRewardAmountUpdatedFixture implements Fixture {
  private apiWrapper: ApiWrapper
  private expectedReward: BN
  private module: WorkingGroups

  private result: BN | undefined
  private events: Event[] = []

  constructor(apiWrapper: ApiWrapper, expectedReward: BN, module: WorkingGroups) {
    this.apiWrapper = apiWrapper
    this.expectedReward = expectedReward
    this.module = module
  }

  public getResult(): BN | undefined {
    return this.result
  }

  public getEvents(): Event[] {
    return this.events
  }

  public async runner(expectFailure: boolean): Promise<void> {
    const event: Event = await this.apiWrapper.expectEvent('WorkerRewardAmountUpdated')
    this.events.push(event)
    const leadWorkerId: BN = (await this.apiWrapper.getLeadWorkerId(this.module))!
    const receivedReward: BN = (await this.apiWrapper.getRewardRelationship(leadWorkerId)).getField<Balance>(
      'amount_per_payout'
    )
    assert(
      receivedReward.eq(this.expectedReward),
      `Unexpected reward amount for worker with id ${leadWorkerId}: ${receivedReward}, expected ${this.expectedReward}`
    )
  }
}

export class ExpectLeaderStakeDecreasedFixture implements Fixture {
  private apiWrapper: ApiWrapper
  private expectedStake: BN
  private module: WorkingGroups

  private result: BN | undefined
  private events: Event[] = []

  constructor(apiWrapper: ApiWrapper, expectedStake: BN, module: WorkingGroups) {
    this.apiWrapper = apiWrapper
    this.expectedStake = expectedStake
    this.module = module
  }

  public getResult(): BN | undefined {
    return this.result
  }

  public getEvents(): Event[] {
    return this.events
  }

  public async runner(expectFailure: boolean): Promise<void> {
    const event: Event = await this.apiWrapper.expectEvent('StakeDecreased')
    this.events.push(event)
    const leadWorkerId: BN = (await this.apiWrapper.getLeadWorkerId(this.module))!
    const receivedStake: BN = await this.apiWrapper.getWorkerStakeAmount(leadWorkerId, this.module)
    assert(
      receivedStake.eq(this.expectedStake),
      `Unexpected stake amount for worker with id ${leadWorkerId}: ${receivedStake}, expected ${this.expectedStake}`
    )
  }
}

export class ExpectLeaderSlashedFixture implements Fixture {
  private apiWrapper: ApiWrapper
  private expectedStake: BN
  private module: WorkingGroups

  private result: BN | undefined
  private events: Event[] = []

  constructor(apiWrapper: ApiWrapper, expectedStake: BN, module: WorkingGroups) {
    this.apiWrapper = apiWrapper
    this.expectedStake = expectedStake
    this.module = module
  }

  public getResult(): BN | undefined {
    return this.result
  }

  public getEvents(): Event[] {
    return this.events
  }

  public async runner(expectFailure: boolean): Promise<void> {
    const event: Event = await this.apiWrapper.expectEvent('StakeSlashed')
    this.events.push(event)
    const leadWorkerId: BN = (await this.apiWrapper.getLeadWorkerId(this.module))!
    const receivedStake: BN = await this.apiWrapper.getWorkerStakeAmount(leadWorkerId, this.module)
    assert(
      receivedStake.eq(this.expectedStake),
      `Unexpected stake amount for worker with id after slash ${leadWorkerId}: ${receivedStake}, expected ${this.expectedStake}`
    )
  }
}

export class ExpectMintCapacityChanged implements Fixture {
  private apiWrapper: ApiWrapper
  private expectedMintCapacity: BN

  private result: BN | undefined
  private events: Event[] = []

  constructor(apiWrapper: ApiWrapper, expectedMintCapacity: BN) {
    this.apiWrapper = apiWrapper
    this.expectedMintCapacity = expectedMintCapacity
  }

  public getResult(): BN | undefined {
    return this.result
  }

  public getEvents(): Event[] {
    return this.events
  }

  public async runner(expectFailure: boolean): Promise<void> {
    const event: Event = await this.apiWrapper.expectEvent('MintCapacityChanged')
    this.events.push(event)
    const receivedMintCapacity = (event.data[1] as unknown) as BN
    assert(
      receivedMintCapacity.eq(this.expectedMintCapacity),
      `Unexpected mint capacity: ${receivedMintCapacity}, expected ${this.expectedMintCapacity}`
    )
    this.result = receivedMintCapacity
  }
}
