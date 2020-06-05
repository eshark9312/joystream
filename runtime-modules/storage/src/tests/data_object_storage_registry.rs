#![cfg(test)]

use super::mock::*;
use srml_support::StorageLinkedMap;

fn hire_storage_provider() -> (u64, u32) {
    let storage_provider_id = 1;
    let role_account_id = 1;

    let storage_provider = bureaucracy::Worker {
        member_id: 1,
        role_account: role_account_id,
        reward_relationship: None,
        role_stake_profile: None,
    };

    <bureaucracy::WorkerById<Test, bureaucracy::Instance2>>::insert(
        storage_provider_id,
        storage_provider,
    );

    (role_account_id, storage_provider_id)
}

#[test]
fn initial_state() {
    with_default_mock_builder(|| {
        assert_eq!(
            TestDataObjectStorageRegistry::first_relationship_id(),
            TEST_FIRST_RELATIONSHIP_ID
        );
    });
}

#[test]
fn add_relationship_fails_with_invalid_authorization() {
    with_default_mock_builder(|| {
        let (account_id, storage_provider_id) = (2, 2);
        // The content needs to exist - in our mock, that's with the content ID TEST_MOCK_EXISTING_CID
        let res = TestDataObjectStorageRegistry::add_relationship(
            Origin::signed(account_id),
            storage_provider_id,
            TEST_MOCK_EXISTING_CID,
        );
        assert_eq!(res, Err(bureaucracy::Error::WorkerDoesNotExist.into()));
    });
}

#[test]
fn set_relationship_ready_fails_with_invalid_authorization() {
    with_default_mock_builder(|| {
        let (account_id, storage_provider_id) = hire_storage_provider();
        // The content needs to exist - in our mock, that's with the content ID TEST_MOCK_EXISTING_CID
        let res = TestDataObjectStorageRegistry::add_relationship(
            Origin::signed(account_id),
            storage_provider_id,
            TEST_MOCK_EXISTING_CID,
        );
        assert!(res.is_ok());

        let (invalid_account_id, invalid_storage_provider_id) = (2, 2);
        let res = TestDataObjectStorageRegistry::set_relationship_ready(
            Origin::signed(invalid_account_id),
            invalid_storage_provider_id,
            TEST_MOCK_EXISTING_CID,
        );
        assert_eq!(res, Err(bureaucracy::Error::WorkerDoesNotExist.into()));
    });
}

#[test]
fn unset_relationship_ready_fails_with_invalid_authorization() {
    with_default_mock_builder(|| {
        let (account_id, storage_provider_id) = hire_storage_provider();
        // The content needs to exist - in our mock, that's with the content ID TEST_MOCK_EXISTING_CID
        let res = TestDataObjectStorageRegistry::add_relationship(
            Origin::signed(account_id),
            storage_provider_id,
            TEST_MOCK_EXISTING_CID,
        );
        assert!(res.is_ok());

        let (invalid_account_id, invalid_storage_provider_id) = (2, 2);
        let res = TestDataObjectStorageRegistry::unset_relationship_ready(
            Origin::signed(invalid_account_id),
            invalid_storage_provider_id,
            TEST_MOCK_EXISTING_CID,
        );
        assert_eq!(res, Err(bureaucracy::Error::WorkerDoesNotExist.into()));
    });
}

#[test]
fn test_add_relationship() {
    with_default_mock_builder(|| {
        let (account_id, storage_provider_id) = hire_storage_provider();
        // The content needs to exist - in our mock, that's with the content ID TEST_MOCK_EXISTING_CID
        let res = TestDataObjectStorageRegistry::add_relationship(
            Origin::signed(account_id),
            storage_provider_id,
            TEST_MOCK_EXISTING_CID,
        );
        assert_eq!(res, Ok(()));
    });
}

#[test]
fn test_fail_adding_relationship_with_bad_content() {
    with_default_mock_builder(|| {
        let (account_id, storage_provider_id) = hire_storage_provider();
        let res = TestDataObjectStorageRegistry::add_relationship(
            Origin::signed(account_id),
            storage_provider_id,
            24,
        );
        assert!(res.is_err());
    });
}

#[test]
fn test_toggle_ready() {
    with_default_mock_builder(|| {
        let (account_id, storage_provider_id) = hire_storage_provider();
        // Create a DOSR
        let res = TestDataObjectStorageRegistry::add_relationship(
            Origin::signed(account_id),
            storage_provider_id,
            TEST_MOCK_EXISTING_CID,
        );
        assert!(res.is_ok());

        // Grab DOSR ID from event
        let dosr_id = match System::events().last().unwrap().event {
            MetaEvent::data_object_storage_registry(
                data_object_storage_registry::RawEvent::DataObjectStorageRelationshipAdded(
                    dosr_id,
                    _content_id,
                    _account_id,
                ),
            ) => dosr_id,
            _ => 0xdeadbeefu64, // invalid value, unlikely to match
        };
        assert_ne!(dosr_id, 0xdeadbeefu64);

        // Toggling from a different account should fail
        let res = TestDataObjectStorageRegistry::set_relationship_ready(
            Origin::signed(2),
            storage_provider_id,
            dosr_id,
        );
        assert!(res.is_err());

        // Toggling with the wrong ID should fail.
        let res = TestDataObjectStorageRegistry::set_relationship_ready(
            Origin::signed(account_id),
            storage_provider_id,
            dosr_id + 1,
        );
        assert!(res.is_err());

        // Toggling with the correct ID and origin should succeed
        let res = TestDataObjectStorageRegistry::set_relationship_ready(
            Origin::signed(account_id),
            storage_provider_id,
            dosr_id,
        );
        assert!(res.is_ok());
        assert_eq!(
            System::events().last().unwrap().event,
            MetaEvent::data_object_storage_registry(
                data_object_storage_registry::RawEvent::DataObjectStorageRelationshipReadyUpdated(
                    dosr_id, true,
                )
            )
        );
    });
}
