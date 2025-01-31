// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

import type { FinalityGrandpaEquivocationPrecommit, FinalityGrandpaEquivocationPrevote, FinalityGrandpaPrecommit, FinalityGrandpaPrevote, FrameSupportDispatchRawOrigin, FrameSupportTokensMiscBalanceStatus, FrameSupportWeightsDispatchClass, FrameSupportWeightsDispatchInfo, FrameSupportWeightsPays, FrameSupportWeightsPerDispatchClassU32, FrameSupportWeightsPerDispatchClassU64, FrameSupportWeightsPerDispatchClassWeightsPerClass, FrameSupportWeightsRuntimeDbWeight, FrameSystemAccountInfo, FrameSystemCall, FrameSystemError, FrameSystemEvent, FrameSystemEventRecord, FrameSystemExtensionsCheckGenesis, FrameSystemExtensionsCheckNonZeroSender, FrameSystemExtensionsCheckNonce, FrameSystemExtensionsCheckSpecVersion, FrameSystemExtensionsCheckTxVersion, FrameSystemExtensionsCheckWeight, FrameSystemLastRuntimeUpgradeInfo, FrameSystemLimitsBlockLength, FrameSystemLimitsBlockWeights, FrameSystemLimitsWeightsPerClass, FrameSystemPhase, JoystreamNodeRuntimeNposSolution16, JoystreamNodeRuntimeOriginCaller, JoystreamNodeRuntimeRuntime, JoystreamNodeRuntimeSessionKeys, PalletAuthorshipCall, PalletAuthorshipError, PalletAuthorshipUncleEntryItem, PalletBabeCall, PalletBabeError, PalletBagsListCall, PalletBagsListError, PalletBagsListEvent, PalletBagsListListBag, PalletBagsListListListError, PalletBagsListListNode, PalletBalancesAccountData, PalletBalancesBalanceLock, PalletBalancesCall, PalletBalancesError, PalletBalancesEvent, PalletBalancesReasons, PalletBalancesReleases, PalletBalancesReserveData, PalletBountyAssuranceContractTypeBTreeSet, PalletBountyAssuranceContractTypeBoundedBTreeSet, PalletBountyBountyActor, PalletBountyBountyMilestone, PalletBountyBountyParametersBTreeSet, PalletBountyBountyParametersBoundedBTreeSet, PalletBountyBountyRecord, PalletBountyCall, PalletBountyContribution, PalletBountyEntryRecord, PalletBountyError, PalletBountyFundingType, PalletBountyOracleWorkEntryJudgment, PalletBountyRawEvent, PalletCommonBalanceKind, PalletCommonBloatBondRepayableBloatBond, PalletCommonFundingRequestParameters, PalletCommonMerkleTreeProofElementRecord, PalletCommonMerkleTreeSide, PalletCommonWorkingGroupIterableEnumsWorkingGroup, PalletConstitutionCall, PalletConstitutionConstitutionInfo, PalletConstitutionRawEvent, PalletContentCall, PalletContentChannelBagWitness, PalletContentChannelCreationParametersRecord, PalletContentChannelFundsDestination, PalletContentChannelOwner, PalletContentChannelPayoutsPayloadParametersRecord, PalletContentChannelRecord, PalletContentChannelTransferStatus, PalletContentChannelUpdateParametersRecord, PalletContentErrorsError, PalletContentInitTransferParameters, PalletContentIterableEnumsChannelActionPermission, PalletContentLimitPerPeriod, PalletContentNftCounter, PalletContentNftLimitPeriod, PalletContentNftTypesEnglishAuctionBid, PalletContentNftTypesEnglishAuctionParamsRecord, PalletContentNftTypesEnglishAuctionRecord, PalletContentNftTypesInitTransactionalStatusRecord, PalletContentNftTypesNftIssuanceParametersRecord, PalletContentNftTypesNftOwner, PalletContentNftTypesOpenAuctionBidRecord, PalletContentNftTypesOpenAuctionParamsRecord, PalletContentNftTypesOpenAuctionRecord, PalletContentNftTypesOwnedNft, PalletContentNftTypesTransactionalStatusRecord, PalletContentPendingTransfer, PalletContentPermissionsContentActor, PalletContentPermissionsCuratorGroupCuratorGroupRecord, PalletContentPermissionsCuratorGroupIterableEnumsContentModerationAction, PalletContentPermissionsCuratorGroupIterableEnumsPausableChannelFeature, PalletContentPullPaymentElement, PalletContentRawEvent, PalletContentStorageAssetsRecord, PalletContentTransferCommitmentParametersBTreeMap, PalletContentTransferCommitmentParametersBoundedBTreeMap, PalletContentUpdateChannelPayoutsParametersRecord, PalletContentVideoCreationParametersRecord, PalletContentVideoRecord, PalletContentVideoUpdateParametersRecord, PalletCouncilCall, PalletCouncilCandidate, PalletCouncilCouncilMember, PalletCouncilCouncilStage, PalletCouncilCouncilStageAnnouncing, PalletCouncilCouncilStageElection, PalletCouncilCouncilStageIdle, PalletCouncilCouncilStageUpdate, PalletCouncilError, PalletCouncilRawEvent, PalletElectionProviderMultiPhaseCall, PalletElectionProviderMultiPhaseElectionCompute, PalletElectionProviderMultiPhaseError, PalletElectionProviderMultiPhaseEvent, PalletElectionProviderMultiPhasePhase, PalletElectionProviderMultiPhaseRawSolution, PalletElectionProviderMultiPhaseReadySolution, PalletElectionProviderMultiPhaseRoundSnapshot, PalletElectionProviderMultiPhaseSignedSignedSubmission, PalletElectionProviderMultiPhaseSolutionOrSnapshotSize, PalletForumCall, PalletForumCategory, PalletForumError, PalletForumExtendedPostIdObject, PalletForumPost, PalletForumPrivilegedActor, PalletForumRawEvent, PalletForumThread, PalletGrandpaCall, PalletGrandpaError, PalletGrandpaEvent, PalletGrandpaStoredPendingChange, PalletGrandpaStoredState, PalletImOnlineBoundedOpaqueNetworkState, PalletImOnlineCall, PalletImOnlineError, PalletImOnlineEvent, PalletImOnlineHeartbeat, PalletImOnlineSr25519AppSr25519Public, PalletImOnlineSr25519AppSr25519Signature, PalletMembershipBuyMembershipParameters, PalletMembershipCall, PalletMembershipCreateMemberParameters, PalletMembershipError, PalletMembershipGiftMembershipParameters, PalletMembershipInviteMembershipParameters, PalletMembershipMembershipObject, PalletMembershipRawEvent, PalletMembershipStakingAccountMemberBinding, PalletMultisigCall, PalletMultisigError, PalletMultisigEvent, PalletMultisigMultisig, PalletMultisigTimepoint, PalletOffencesEvent, PalletProjectTokenAccountData, PalletProjectTokenCall, PalletProjectTokenErrorsError, PalletProjectTokenEventsRawEvent, PalletProjectTokenMerkleProof, PalletProjectTokenMerkleSide, PalletProjectTokenPatronageData, PalletProjectTokenPayment, PalletProjectTokenPaymentWithVesting, PalletProjectTokenRevenueSplitInfo, PalletProjectTokenRevenueSplitState, PalletProjectTokenSingleDataObjectUploadParams, PalletProjectTokenStakingStatus, PalletProjectTokenTimeline, PalletProjectTokenTokenAllocation, PalletProjectTokenTokenData, PalletProjectTokenTokenIssuanceParameters, PalletProjectTokenTokenSale, PalletProjectTokenTokenSaleParams, PalletProjectTokenTransferPolicy, PalletProjectTokenTransferPolicyParams, PalletProjectTokenTransfersPayment, PalletProjectTokenTransfersPaymentWithVesting, PalletProjectTokenValidated, PalletProjectTokenValidatedPayment, PalletProjectTokenVestingSchedule, PalletProjectTokenVestingScheduleParams, PalletProjectTokenVestingSource, PalletProjectTokenWhitelistParams, PalletProposalsCodexCall, PalletProposalsCodexCreateOpeningParameters, PalletProposalsCodexError, PalletProposalsCodexFillOpeningParameters, PalletProposalsCodexGeneralProposalParams, PalletProposalsCodexProposalDetails, PalletProposalsCodexRawEvent, PalletProposalsCodexTerminateRoleParameters, PalletProposalsDiscussionCall, PalletProposalsDiscussionDiscussionPost, PalletProposalsDiscussionDiscussionThread, PalletProposalsDiscussionError, PalletProposalsDiscussionRawEvent, PalletProposalsDiscussionThreadModeBTreeSet, PalletProposalsDiscussionThreadModeBoundedBTreeSet, PalletProposalsEngineCall, PalletProposalsEngineError, PalletProposalsEngineProposal, PalletProposalsEngineProposalParameters, PalletProposalsEngineProposalStatusesApprovedProposalDecision, PalletProposalsEngineProposalStatusesExecutionStatus, PalletProposalsEngineProposalStatusesProposalDecision, PalletProposalsEngineProposalStatusesProposalStatus, PalletProposalsEngineRawEvent, PalletProposalsEngineVoteKind, PalletProposalsEngineVotingResults, PalletReferendumCall, PalletReferendumCastVote, PalletReferendumError, PalletReferendumInstance1, PalletReferendumOptionResult, PalletReferendumRawEvent, PalletReferendumReferendumStage, PalletReferendumReferendumStageRevealing, PalletReferendumReferendumStageVoting, PalletSessionCall, PalletSessionError, PalletSessionEvent, PalletStakingActiveEraInfo, PalletStakingEraRewardPoints, PalletStakingExposure, PalletStakingForcing, PalletStakingIndividualExposure, PalletStakingNominations, PalletStakingPalletCall, PalletStakingPalletConfigOpPerbill, PalletStakingPalletConfigOpPercent, PalletStakingPalletConfigOpU128, PalletStakingPalletConfigOpU32, PalletStakingPalletError, PalletStakingPalletEvent, PalletStakingReleases, PalletStakingRewardDestination, PalletStakingSlashingSlashingSpans, PalletStakingSlashingSpanRecord, PalletStakingStakingLedger, PalletStakingUnappliedSlash, PalletStakingUnlockChunk, PalletStakingValidatorPrefs, PalletStorageBagIdType, PalletStorageBagRecord, PalletStorageCall, PalletStorageDataObject, PalletStorageDataObjectCreationParameters, PalletStorageDistributionBucketFamilyRecord, PalletStorageDistributionBucketIdRecord, PalletStorageDistributionBucketRecord, PalletStorageDynBagCreationParametersRecord, PalletStorageDynamicBagCreationPolicy, PalletStorageDynamicBagIdType, PalletStorageDynamicBagType, PalletStorageError, PalletStorageRawEvent, PalletStorageStaticBagId, PalletStorageStorageBucketOperatorStatus, PalletStorageStorageBucketRecord, PalletStorageUploadParametersRecord, PalletStorageVoucher, PalletTimestampCall, PalletTransactionPaymentChargeTransactionPayment, PalletTransactionPaymentReleases, PalletUtilityCall, PalletUtilityError, PalletUtilityEvent, PalletUtilityRawEvent, PalletVestingCall, PalletVestingError, PalletVestingEvent, PalletVestingReleases, PalletVestingVestingInfo, PalletWorkingGroupApplyOnOpeningParams, PalletWorkingGroupCall, PalletWorkingGroupErrorsError, PalletWorkingGroupGroupWorker, PalletWorkingGroupInstance1, PalletWorkingGroupInstance2, PalletWorkingGroupInstance3, PalletWorkingGroupInstance4, PalletWorkingGroupInstance5, PalletWorkingGroupInstance6, PalletWorkingGroupInstance7, PalletWorkingGroupInstance8, PalletWorkingGroupInstance9, PalletWorkingGroupJobApplication, PalletWorkingGroupOpening, PalletWorkingGroupOpeningType, PalletWorkingGroupRawEventInstance1, PalletWorkingGroupRawEventInstance2, PalletWorkingGroupRawEventInstance3, PalletWorkingGroupRawEventInstance4, PalletWorkingGroupRawEventInstance5, PalletWorkingGroupRawEventInstance6, PalletWorkingGroupRawEventInstance7, PalletWorkingGroupRawEventInstance8, PalletWorkingGroupRawEventInstance9, PalletWorkingGroupRewardPaymentType, PalletWorkingGroupStakeParameters, PalletWorkingGroupStakePolicy, SpAuthorityDiscoveryAppPublic, SpConsensusBabeAllowedSlots, SpConsensusBabeAppPublic, SpConsensusBabeBabeEpochConfiguration, SpConsensusBabeDigestsNextConfigDescriptor, SpConsensusBabeDigestsPreDigest, SpConsensusBabeDigestsPrimaryPreDigest, SpConsensusBabeDigestsSecondaryPlainPreDigest, SpConsensusBabeDigestsSecondaryVRFPreDigest, SpConsensusSlotsEquivocationProof, SpCoreCryptoKeyTypeId, SpCoreEcdsaSignature, SpCoreEd25519Public, SpCoreEd25519Signature, SpCoreOffchainOpaqueNetworkState, SpCoreSr25519Public, SpCoreSr25519Signature, SpCoreVoid, SpFinalityGrandpaAppPublic, SpFinalityGrandpaAppSignature, SpFinalityGrandpaEquivocation, SpFinalityGrandpaEquivocationProof, SpNposElectionsElectionScore, SpNposElectionsSupport, SpRuntimeArithmeticError, SpRuntimeBlakeTwo256, SpRuntimeDigest, SpRuntimeDigestDigestItem, SpRuntimeDispatchError, SpRuntimeHeader, SpRuntimeModuleError, SpRuntimeMultiSignature, SpRuntimeTokenError, SpRuntimeTransactionalError, SpSessionMembershipProof, SpStakingOffenceOffenceDetails, SpVersionRuntimeVersion } from '@polkadot/types/lookup';

declare module '@polkadot/types/types/registry' {
  export interface InterfaceTypes {
    FinalityGrandpaEquivocationPrecommit: FinalityGrandpaEquivocationPrecommit;
    FinalityGrandpaEquivocationPrevote: FinalityGrandpaEquivocationPrevote;
    FinalityGrandpaPrecommit: FinalityGrandpaPrecommit;
    FinalityGrandpaPrevote: FinalityGrandpaPrevote;
    FrameSupportDispatchRawOrigin: FrameSupportDispatchRawOrigin;
    FrameSupportTokensMiscBalanceStatus: FrameSupportTokensMiscBalanceStatus;
    FrameSupportWeightsDispatchClass: FrameSupportWeightsDispatchClass;
    FrameSupportWeightsDispatchInfo: FrameSupportWeightsDispatchInfo;
    FrameSupportWeightsPays: FrameSupportWeightsPays;
    FrameSupportWeightsPerDispatchClassU32: FrameSupportWeightsPerDispatchClassU32;
    FrameSupportWeightsPerDispatchClassU64: FrameSupportWeightsPerDispatchClassU64;
    FrameSupportWeightsPerDispatchClassWeightsPerClass: FrameSupportWeightsPerDispatchClassWeightsPerClass;
    FrameSupportWeightsRuntimeDbWeight: FrameSupportWeightsRuntimeDbWeight;
    FrameSystemAccountInfo: FrameSystemAccountInfo;
    FrameSystemCall: FrameSystemCall;
    FrameSystemError: FrameSystemError;
    FrameSystemEvent: FrameSystemEvent;
    FrameSystemEventRecord: FrameSystemEventRecord;
    FrameSystemExtensionsCheckGenesis: FrameSystemExtensionsCheckGenesis;
    FrameSystemExtensionsCheckNonZeroSender: FrameSystemExtensionsCheckNonZeroSender;
    FrameSystemExtensionsCheckNonce: FrameSystemExtensionsCheckNonce;
    FrameSystemExtensionsCheckSpecVersion: FrameSystemExtensionsCheckSpecVersion;
    FrameSystemExtensionsCheckTxVersion: FrameSystemExtensionsCheckTxVersion;
    FrameSystemExtensionsCheckWeight: FrameSystemExtensionsCheckWeight;
    FrameSystemLastRuntimeUpgradeInfo: FrameSystemLastRuntimeUpgradeInfo;
    FrameSystemLimitsBlockLength: FrameSystemLimitsBlockLength;
    FrameSystemLimitsBlockWeights: FrameSystemLimitsBlockWeights;
    FrameSystemLimitsWeightsPerClass: FrameSystemLimitsWeightsPerClass;
    FrameSystemPhase: FrameSystemPhase;
    JoystreamNodeRuntimeNposSolution16: JoystreamNodeRuntimeNposSolution16;
    JoystreamNodeRuntimeOriginCaller: JoystreamNodeRuntimeOriginCaller;
    JoystreamNodeRuntimeRuntime: JoystreamNodeRuntimeRuntime;
    JoystreamNodeRuntimeSessionKeys: JoystreamNodeRuntimeSessionKeys;
    PalletAuthorshipCall: PalletAuthorshipCall;
    PalletAuthorshipError: PalletAuthorshipError;
    PalletAuthorshipUncleEntryItem: PalletAuthorshipUncleEntryItem;
    PalletBabeCall: PalletBabeCall;
    PalletBabeError: PalletBabeError;
    PalletBagsListCall: PalletBagsListCall;
    PalletBagsListError: PalletBagsListError;
    PalletBagsListEvent: PalletBagsListEvent;
    PalletBagsListListBag: PalletBagsListListBag;
    PalletBagsListListListError: PalletBagsListListListError;
    PalletBagsListListNode: PalletBagsListListNode;
    PalletBalancesAccountData: PalletBalancesAccountData;
    PalletBalancesBalanceLock: PalletBalancesBalanceLock;
    PalletBalancesCall: PalletBalancesCall;
    PalletBalancesError: PalletBalancesError;
    PalletBalancesEvent: PalletBalancesEvent;
    PalletBalancesReasons: PalletBalancesReasons;
    PalletBalancesReleases: PalletBalancesReleases;
    PalletBalancesReserveData: PalletBalancesReserveData;
    PalletBountyAssuranceContractTypeBTreeSet: PalletBountyAssuranceContractTypeBTreeSet;
    PalletBountyAssuranceContractTypeBoundedBTreeSet: PalletBountyAssuranceContractTypeBoundedBTreeSet;
    PalletBountyBountyActor: PalletBountyBountyActor;
    PalletBountyBountyMilestone: PalletBountyBountyMilestone;
    PalletBountyBountyParametersBTreeSet: PalletBountyBountyParametersBTreeSet;
    PalletBountyBountyParametersBoundedBTreeSet: PalletBountyBountyParametersBoundedBTreeSet;
    PalletBountyBountyRecord: PalletBountyBountyRecord;
    PalletBountyCall: PalletBountyCall;
    PalletBountyContribution: PalletBountyContribution;
    PalletBountyEntryRecord: PalletBountyEntryRecord;
    PalletBountyError: PalletBountyError;
    PalletBountyFundingType: PalletBountyFundingType;
    PalletBountyOracleWorkEntryJudgment: PalletBountyOracleWorkEntryJudgment;
    PalletBountyRawEvent: PalletBountyRawEvent;
    PalletCommonBalanceKind: PalletCommonBalanceKind;
    PalletCommonBloatBondRepayableBloatBond: PalletCommonBloatBondRepayableBloatBond;
    PalletCommonFundingRequestParameters: PalletCommonFundingRequestParameters;
    PalletCommonMerkleTreeProofElementRecord: PalletCommonMerkleTreeProofElementRecord;
    PalletCommonMerkleTreeSide: PalletCommonMerkleTreeSide;
    PalletCommonWorkingGroupIterableEnumsWorkingGroup: PalletCommonWorkingGroupIterableEnumsWorkingGroup;
    PalletConstitutionCall: PalletConstitutionCall;
    PalletConstitutionConstitutionInfo: PalletConstitutionConstitutionInfo;
    PalletConstitutionRawEvent: PalletConstitutionRawEvent;
    PalletContentCall: PalletContentCall;
    PalletContentChannelBagWitness: PalletContentChannelBagWitness;
    PalletContentChannelCreationParametersRecord: PalletContentChannelCreationParametersRecord;
    PalletContentChannelFundsDestination: PalletContentChannelFundsDestination;
    PalletContentChannelOwner: PalletContentChannelOwner;
    PalletContentChannelPayoutsPayloadParametersRecord: PalletContentChannelPayoutsPayloadParametersRecord;
    PalletContentChannelRecord: PalletContentChannelRecord;
    PalletContentChannelTransferStatus: PalletContentChannelTransferStatus;
    PalletContentChannelUpdateParametersRecord: PalletContentChannelUpdateParametersRecord;
    PalletContentErrorsError: PalletContentErrorsError;
    PalletContentInitTransferParameters: PalletContentInitTransferParameters;
    PalletContentIterableEnumsChannelActionPermission: PalletContentIterableEnumsChannelActionPermission;
    PalletContentLimitPerPeriod: PalletContentLimitPerPeriod;
    PalletContentNftCounter: PalletContentNftCounter;
    PalletContentNftLimitPeriod: PalletContentNftLimitPeriod;
    PalletContentNftTypesEnglishAuctionBid: PalletContentNftTypesEnglishAuctionBid;
    PalletContentNftTypesEnglishAuctionParamsRecord: PalletContentNftTypesEnglishAuctionParamsRecord;
    PalletContentNftTypesEnglishAuctionRecord: PalletContentNftTypesEnglishAuctionRecord;
    PalletContentNftTypesInitTransactionalStatusRecord: PalletContentNftTypesInitTransactionalStatusRecord;
    PalletContentNftTypesNftIssuanceParametersRecord: PalletContentNftTypesNftIssuanceParametersRecord;
    PalletContentNftTypesNftOwner: PalletContentNftTypesNftOwner;
    PalletContentNftTypesOpenAuctionBidRecord: PalletContentNftTypesOpenAuctionBidRecord;
    PalletContentNftTypesOpenAuctionParamsRecord: PalletContentNftTypesOpenAuctionParamsRecord;
    PalletContentNftTypesOpenAuctionRecord: PalletContentNftTypesOpenAuctionRecord;
    PalletContentNftTypesOwnedNft: PalletContentNftTypesOwnedNft;
    PalletContentNftTypesTransactionalStatusRecord: PalletContentNftTypesTransactionalStatusRecord;
    PalletContentPendingTransfer: PalletContentPendingTransfer;
    PalletContentPermissionsContentActor: PalletContentPermissionsContentActor;
    PalletContentPermissionsCuratorGroupCuratorGroupRecord: PalletContentPermissionsCuratorGroupCuratorGroupRecord;
    PalletContentPermissionsCuratorGroupIterableEnumsContentModerationAction: PalletContentPermissionsCuratorGroupIterableEnumsContentModerationAction;
    PalletContentPermissionsCuratorGroupIterableEnumsPausableChannelFeature: PalletContentPermissionsCuratorGroupIterableEnumsPausableChannelFeature;
    PalletContentPullPaymentElement: PalletContentPullPaymentElement;
    PalletContentRawEvent: PalletContentRawEvent;
    PalletContentStorageAssetsRecord: PalletContentStorageAssetsRecord;
    PalletContentTransferCommitmentParametersBTreeMap: PalletContentTransferCommitmentParametersBTreeMap;
    PalletContentTransferCommitmentParametersBoundedBTreeMap: PalletContentTransferCommitmentParametersBoundedBTreeMap;
    PalletContentUpdateChannelPayoutsParametersRecord: PalletContentUpdateChannelPayoutsParametersRecord;
    PalletContentVideoCreationParametersRecord: PalletContentVideoCreationParametersRecord;
    PalletContentVideoRecord: PalletContentVideoRecord;
    PalletContentVideoUpdateParametersRecord: PalletContentVideoUpdateParametersRecord;
    PalletCouncilCall: PalletCouncilCall;
    PalletCouncilCandidate: PalletCouncilCandidate;
    PalletCouncilCouncilMember: PalletCouncilCouncilMember;
    PalletCouncilCouncilStage: PalletCouncilCouncilStage;
    PalletCouncilCouncilStageAnnouncing: PalletCouncilCouncilStageAnnouncing;
    PalletCouncilCouncilStageElection: PalletCouncilCouncilStageElection;
    PalletCouncilCouncilStageIdle: PalletCouncilCouncilStageIdle;
    PalletCouncilCouncilStageUpdate: PalletCouncilCouncilStageUpdate;
    PalletCouncilError: PalletCouncilError;
    PalletCouncilRawEvent: PalletCouncilRawEvent;
    PalletElectionProviderMultiPhaseCall: PalletElectionProviderMultiPhaseCall;
    PalletElectionProviderMultiPhaseElectionCompute: PalletElectionProviderMultiPhaseElectionCompute;
    PalletElectionProviderMultiPhaseError: PalletElectionProviderMultiPhaseError;
    PalletElectionProviderMultiPhaseEvent: PalletElectionProviderMultiPhaseEvent;
    PalletElectionProviderMultiPhasePhase: PalletElectionProviderMultiPhasePhase;
    PalletElectionProviderMultiPhaseRawSolution: PalletElectionProviderMultiPhaseRawSolution;
    PalletElectionProviderMultiPhaseReadySolution: PalletElectionProviderMultiPhaseReadySolution;
    PalletElectionProviderMultiPhaseRoundSnapshot: PalletElectionProviderMultiPhaseRoundSnapshot;
    PalletElectionProviderMultiPhaseSignedSignedSubmission: PalletElectionProviderMultiPhaseSignedSignedSubmission;
    PalletElectionProviderMultiPhaseSolutionOrSnapshotSize: PalletElectionProviderMultiPhaseSolutionOrSnapshotSize;
    PalletForumCall: PalletForumCall;
    PalletForumCategory: PalletForumCategory;
    PalletForumError: PalletForumError;
    PalletForumExtendedPostIdObject: PalletForumExtendedPostIdObject;
    PalletForumPost: PalletForumPost;
    PalletForumPrivilegedActor: PalletForumPrivilegedActor;
    PalletForumRawEvent: PalletForumRawEvent;
    PalletForumThread: PalletForumThread;
    PalletGrandpaCall: PalletGrandpaCall;
    PalletGrandpaError: PalletGrandpaError;
    PalletGrandpaEvent: PalletGrandpaEvent;
    PalletGrandpaStoredPendingChange: PalletGrandpaStoredPendingChange;
    PalletGrandpaStoredState: PalletGrandpaStoredState;
    PalletImOnlineBoundedOpaqueNetworkState: PalletImOnlineBoundedOpaqueNetworkState;
    PalletImOnlineCall: PalletImOnlineCall;
    PalletImOnlineError: PalletImOnlineError;
    PalletImOnlineEvent: PalletImOnlineEvent;
    PalletImOnlineHeartbeat: PalletImOnlineHeartbeat;
    PalletImOnlineSr25519AppSr25519Public: PalletImOnlineSr25519AppSr25519Public;
    PalletImOnlineSr25519AppSr25519Signature: PalletImOnlineSr25519AppSr25519Signature;
    PalletMembershipBuyMembershipParameters: PalletMembershipBuyMembershipParameters;
    PalletMembershipCall: PalletMembershipCall;
    PalletMembershipCreateMemberParameters: PalletMembershipCreateMemberParameters;
    PalletMembershipError: PalletMembershipError;
    PalletMembershipGiftMembershipParameters: PalletMembershipGiftMembershipParameters;
    PalletMembershipInviteMembershipParameters: PalletMembershipInviteMembershipParameters;
    PalletMembershipMembershipObject: PalletMembershipMembershipObject;
    PalletMembershipRawEvent: PalletMembershipRawEvent;
    PalletMembershipStakingAccountMemberBinding: PalletMembershipStakingAccountMemberBinding;
    PalletMultisigCall: PalletMultisigCall;
    PalletMultisigError: PalletMultisigError;
    PalletMultisigEvent: PalletMultisigEvent;
    PalletMultisigMultisig: PalletMultisigMultisig;
    PalletMultisigTimepoint: PalletMultisigTimepoint;
    PalletOffencesEvent: PalletOffencesEvent;
    PalletProjectTokenAccountData: PalletProjectTokenAccountData;
    PalletProjectTokenCall: PalletProjectTokenCall;
    PalletProjectTokenErrorsError: PalletProjectTokenErrorsError;
    PalletProjectTokenEventsRawEvent: PalletProjectTokenEventsRawEvent;
    PalletProjectTokenMerkleProof: PalletProjectTokenMerkleProof;
    PalletProjectTokenMerkleSide: PalletProjectTokenMerkleSide;
    PalletProjectTokenPatronageData: PalletProjectTokenPatronageData;
    PalletProjectTokenPayment: PalletProjectTokenPayment;
    PalletProjectTokenPaymentWithVesting: PalletProjectTokenPaymentWithVesting;
    PalletProjectTokenRevenueSplitInfo: PalletProjectTokenRevenueSplitInfo;
    PalletProjectTokenRevenueSplitState: PalletProjectTokenRevenueSplitState;
    PalletProjectTokenSingleDataObjectUploadParams: PalletProjectTokenSingleDataObjectUploadParams;
    PalletProjectTokenStakingStatus: PalletProjectTokenStakingStatus;
    PalletProjectTokenTimeline: PalletProjectTokenTimeline;
    PalletProjectTokenTokenAllocation: PalletProjectTokenTokenAllocation;
    PalletProjectTokenTokenData: PalletProjectTokenTokenData;
    PalletProjectTokenTokenIssuanceParameters: PalletProjectTokenTokenIssuanceParameters;
    PalletProjectTokenTokenSale: PalletProjectTokenTokenSale;
    PalletProjectTokenTokenSaleParams: PalletProjectTokenTokenSaleParams;
    PalletProjectTokenTransferPolicy: PalletProjectTokenTransferPolicy;
    PalletProjectTokenTransferPolicyParams: PalletProjectTokenTransferPolicyParams;
    PalletProjectTokenTransfersPayment: PalletProjectTokenTransfersPayment;
    PalletProjectTokenTransfersPaymentWithVesting: PalletProjectTokenTransfersPaymentWithVesting;
    PalletProjectTokenValidated: PalletProjectTokenValidated;
    PalletProjectTokenValidatedPayment: PalletProjectTokenValidatedPayment;
    PalletProjectTokenVestingSchedule: PalletProjectTokenVestingSchedule;
    PalletProjectTokenVestingScheduleParams: PalletProjectTokenVestingScheduleParams;
    PalletProjectTokenVestingSource: PalletProjectTokenVestingSource;
    PalletProjectTokenWhitelistParams: PalletProjectTokenWhitelistParams;
    PalletProposalsCodexCall: PalletProposalsCodexCall;
    PalletProposalsCodexCreateOpeningParameters: PalletProposalsCodexCreateOpeningParameters;
    PalletProposalsCodexError: PalletProposalsCodexError;
    PalletProposalsCodexFillOpeningParameters: PalletProposalsCodexFillOpeningParameters;
    PalletProposalsCodexGeneralProposalParams: PalletProposalsCodexGeneralProposalParams;
    PalletProposalsCodexProposalDetails: PalletProposalsCodexProposalDetails;
    PalletProposalsCodexRawEvent: PalletProposalsCodexRawEvent;
    PalletProposalsCodexTerminateRoleParameters: PalletProposalsCodexTerminateRoleParameters;
    PalletProposalsDiscussionCall: PalletProposalsDiscussionCall;
    PalletProposalsDiscussionDiscussionPost: PalletProposalsDiscussionDiscussionPost;
    PalletProposalsDiscussionDiscussionThread: PalletProposalsDiscussionDiscussionThread;
    PalletProposalsDiscussionError: PalletProposalsDiscussionError;
    PalletProposalsDiscussionRawEvent: PalletProposalsDiscussionRawEvent;
    PalletProposalsDiscussionThreadModeBTreeSet: PalletProposalsDiscussionThreadModeBTreeSet;
    PalletProposalsDiscussionThreadModeBoundedBTreeSet: PalletProposalsDiscussionThreadModeBoundedBTreeSet;
    PalletProposalsEngineCall: PalletProposalsEngineCall;
    PalletProposalsEngineError: PalletProposalsEngineError;
    PalletProposalsEngineProposal: PalletProposalsEngineProposal;
    PalletProposalsEngineProposalParameters: PalletProposalsEngineProposalParameters;
    PalletProposalsEngineProposalStatusesApprovedProposalDecision: PalletProposalsEngineProposalStatusesApprovedProposalDecision;
    PalletProposalsEngineProposalStatusesExecutionStatus: PalletProposalsEngineProposalStatusesExecutionStatus;
    PalletProposalsEngineProposalStatusesProposalDecision: PalletProposalsEngineProposalStatusesProposalDecision;
    PalletProposalsEngineProposalStatusesProposalStatus: PalletProposalsEngineProposalStatusesProposalStatus;
    PalletProposalsEngineRawEvent: PalletProposalsEngineRawEvent;
    PalletProposalsEngineVoteKind: PalletProposalsEngineVoteKind;
    PalletProposalsEngineVotingResults: PalletProposalsEngineVotingResults;
    PalletReferendumCall: PalletReferendumCall;
    PalletReferendumCastVote: PalletReferendumCastVote;
    PalletReferendumError: PalletReferendumError;
    PalletReferendumInstance1: PalletReferendumInstance1;
    PalletReferendumOptionResult: PalletReferendumOptionResult;
    PalletReferendumRawEvent: PalletReferendumRawEvent;
    PalletReferendumReferendumStage: PalletReferendumReferendumStage;
    PalletReferendumReferendumStageRevealing: PalletReferendumReferendumStageRevealing;
    PalletReferendumReferendumStageVoting: PalletReferendumReferendumStageVoting;
    PalletSessionCall: PalletSessionCall;
    PalletSessionError: PalletSessionError;
    PalletSessionEvent: PalletSessionEvent;
    PalletStakingActiveEraInfo: PalletStakingActiveEraInfo;
    PalletStakingEraRewardPoints: PalletStakingEraRewardPoints;
    PalletStakingExposure: PalletStakingExposure;
    PalletStakingForcing: PalletStakingForcing;
    PalletStakingIndividualExposure: PalletStakingIndividualExposure;
    PalletStakingNominations: PalletStakingNominations;
    PalletStakingPalletCall: PalletStakingPalletCall;
    PalletStakingPalletConfigOpPerbill: PalletStakingPalletConfigOpPerbill;
    PalletStakingPalletConfigOpPercent: PalletStakingPalletConfigOpPercent;
    PalletStakingPalletConfigOpU128: PalletStakingPalletConfigOpU128;
    PalletStakingPalletConfigOpU32: PalletStakingPalletConfigOpU32;
    PalletStakingPalletError: PalletStakingPalletError;
    PalletStakingPalletEvent: PalletStakingPalletEvent;
    PalletStakingReleases: PalletStakingReleases;
    PalletStakingRewardDestination: PalletStakingRewardDestination;
    PalletStakingSlashingSlashingSpans: PalletStakingSlashingSlashingSpans;
    PalletStakingSlashingSpanRecord: PalletStakingSlashingSpanRecord;
    PalletStakingStakingLedger: PalletStakingStakingLedger;
    PalletStakingUnappliedSlash: PalletStakingUnappliedSlash;
    PalletStakingUnlockChunk: PalletStakingUnlockChunk;
    PalletStakingValidatorPrefs: PalletStakingValidatorPrefs;
    PalletStorageBagIdType: PalletStorageBagIdType;
    PalletStorageBagRecord: PalletStorageBagRecord;
    PalletStorageCall: PalletStorageCall;
    PalletStorageDataObject: PalletStorageDataObject;
    PalletStorageDataObjectCreationParameters: PalletStorageDataObjectCreationParameters;
    PalletStorageDistributionBucketFamilyRecord: PalletStorageDistributionBucketFamilyRecord;
    PalletStorageDistributionBucketIdRecord: PalletStorageDistributionBucketIdRecord;
    PalletStorageDistributionBucketRecord: PalletStorageDistributionBucketRecord;
    PalletStorageDynBagCreationParametersRecord: PalletStorageDynBagCreationParametersRecord;
    PalletStorageDynamicBagCreationPolicy: PalletStorageDynamicBagCreationPolicy;
    PalletStorageDynamicBagIdType: PalletStorageDynamicBagIdType;
    PalletStorageDynamicBagType: PalletStorageDynamicBagType;
    PalletStorageError: PalletStorageError;
    PalletStorageRawEvent: PalletStorageRawEvent;
    PalletStorageStaticBagId: PalletStorageStaticBagId;
    PalletStorageStorageBucketOperatorStatus: PalletStorageStorageBucketOperatorStatus;
    PalletStorageStorageBucketRecord: PalletStorageStorageBucketRecord;
    PalletStorageUploadParametersRecord: PalletStorageUploadParametersRecord;
    PalletStorageVoucher: PalletStorageVoucher;
    PalletTimestampCall: PalletTimestampCall;
    PalletTransactionPaymentChargeTransactionPayment: PalletTransactionPaymentChargeTransactionPayment;
    PalletTransactionPaymentReleases: PalletTransactionPaymentReleases;
    PalletUtilityCall: PalletUtilityCall;
    PalletUtilityError: PalletUtilityError;
    PalletUtilityEvent: PalletUtilityEvent;
    PalletUtilityRawEvent: PalletUtilityRawEvent;
    PalletVestingCall: PalletVestingCall;
    PalletVestingError: PalletVestingError;
    PalletVestingEvent: PalletVestingEvent;
    PalletVestingReleases: PalletVestingReleases;
    PalletVestingVestingInfo: PalletVestingVestingInfo;
    PalletWorkingGroupApplyOnOpeningParams: PalletWorkingGroupApplyOnOpeningParams;
    PalletWorkingGroupCall: PalletWorkingGroupCall;
    PalletWorkingGroupErrorsError: PalletWorkingGroupErrorsError;
    PalletWorkingGroupGroupWorker: PalletWorkingGroupGroupWorker;
    PalletWorkingGroupInstance1: PalletWorkingGroupInstance1;
    PalletWorkingGroupInstance2: PalletWorkingGroupInstance2;
    PalletWorkingGroupInstance3: PalletWorkingGroupInstance3;
    PalletWorkingGroupInstance4: PalletWorkingGroupInstance4;
    PalletWorkingGroupInstance5: PalletWorkingGroupInstance5;
    PalletWorkingGroupInstance6: PalletWorkingGroupInstance6;
    PalletWorkingGroupInstance7: PalletWorkingGroupInstance7;
    PalletWorkingGroupInstance8: PalletWorkingGroupInstance8;
    PalletWorkingGroupInstance9: PalletWorkingGroupInstance9;
    PalletWorkingGroupJobApplication: PalletWorkingGroupJobApplication;
    PalletWorkingGroupOpening: PalletWorkingGroupOpening;
    PalletWorkingGroupOpeningType: PalletWorkingGroupOpeningType;
    PalletWorkingGroupRawEventInstance1: PalletWorkingGroupRawEventInstance1;
    PalletWorkingGroupRawEventInstance2: PalletWorkingGroupRawEventInstance2;
    PalletWorkingGroupRawEventInstance3: PalletWorkingGroupRawEventInstance3;
    PalletWorkingGroupRawEventInstance4: PalletWorkingGroupRawEventInstance4;
    PalletWorkingGroupRawEventInstance5: PalletWorkingGroupRawEventInstance5;
    PalletWorkingGroupRawEventInstance6: PalletWorkingGroupRawEventInstance6;
    PalletWorkingGroupRawEventInstance7: PalletWorkingGroupRawEventInstance7;
    PalletWorkingGroupRawEventInstance8: PalletWorkingGroupRawEventInstance8;
    PalletWorkingGroupRawEventInstance9: PalletWorkingGroupRawEventInstance9;
    PalletWorkingGroupRewardPaymentType: PalletWorkingGroupRewardPaymentType;
    PalletWorkingGroupStakeParameters: PalletWorkingGroupStakeParameters;
    PalletWorkingGroupStakePolicy: PalletWorkingGroupStakePolicy;
    SpAuthorityDiscoveryAppPublic: SpAuthorityDiscoveryAppPublic;
    SpConsensusBabeAllowedSlots: SpConsensusBabeAllowedSlots;
    SpConsensusBabeAppPublic: SpConsensusBabeAppPublic;
    SpConsensusBabeBabeEpochConfiguration: SpConsensusBabeBabeEpochConfiguration;
    SpConsensusBabeDigestsNextConfigDescriptor: SpConsensusBabeDigestsNextConfigDescriptor;
    SpConsensusBabeDigestsPreDigest: SpConsensusBabeDigestsPreDigest;
    SpConsensusBabeDigestsPrimaryPreDigest: SpConsensusBabeDigestsPrimaryPreDigest;
    SpConsensusBabeDigestsSecondaryPlainPreDigest: SpConsensusBabeDigestsSecondaryPlainPreDigest;
    SpConsensusBabeDigestsSecondaryVRFPreDigest: SpConsensusBabeDigestsSecondaryVRFPreDigest;
    SpConsensusSlotsEquivocationProof: SpConsensusSlotsEquivocationProof;
    SpCoreCryptoKeyTypeId: SpCoreCryptoKeyTypeId;
    SpCoreEcdsaSignature: SpCoreEcdsaSignature;
    SpCoreEd25519Public: SpCoreEd25519Public;
    SpCoreEd25519Signature: SpCoreEd25519Signature;
    SpCoreOffchainOpaqueNetworkState: SpCoreOffchainOpaqueNetworkState;
    SpCoreSr25519Public: SpCoreSr25519Public;
    SpCoreSr25519Signature: SpCoreSr25519Signature;
    SpCoreVoid: SpCoreVoid;
    SpFinalityGrandpaAppPublic: SpFinalityGrandpaAppPublic;
    SpFinalityGrandpaAppSignature: SpFinalityGrandpaAppSignature;
    SpFinalityGrandpaEquivocation: SpFinalityGrandpaEquivocation;
    SpFinalityGrandpaEquivocationProof: SpFinalityGrandpaEquivocationProof;
    SpNposElectionsElectionScore: SpNposElectionsElectionScore;
    SpNposElectionsSupport: SpNposElectionsSupport;
    SpRuntimeArithmeticError: SpRuntimeArithmeticError;
    SpRuntimeBlakeTwo256: SpRuntimeBlakeTwo256;
    SpRuntimeDigest: SpRuntimeDigest;
    SpRuntimeDigestDigestItem: SpRuntimeDigestDigestItem;
    SpRuntimeDispatchError: SpRuntimeDispatchError;
    SpRuntimeHeader: SpRuntimeHeader;
    SpRuntimeModuleError: SpRuntimeModuleError;
    SpRuntimeMultiSignature: SpRuntimeMultiSignature;
    SpRuntimeTokenError: SpRuntimeTokenError;
    SpRuntimeTransactionalError: SpRuntimeTransactionalError;
    SpSessionMembershipProof: SpSessionMembershipProof;
    SpStakingOffenceOffenceDetails: SpStakingOffenceOffenceDetails;
    SpVersionRuntimeVersion: SpVersionRuntimeVersion;
  } // InterfaceTypes
} // declare module
