# Aethyr Aid Testnet User Walkthrough

Use this runbook against hardened Aid contract [`CBZKE67HDBTWIZLKZFJOMEMJSENJOUHJVBURYED5M7VYUQCPJH5VOVIC`](https://stellar.expert/explorer/testnet/contract/CBZKE67HDBTWIZLKZFJOMEMJSENJOUHJVBURYED5M7VYUQCPJH5VOVIC). Do not validate the older contract named in historical records: it predates the verifier self-approval fix.

## 1. Before opening the app

1. Install Freighter and select **Testnet**.
2. Fund every Testnet account at [Stellar Laboratory Friendbot](https://laboratory.stellar.org/#account-creator?network=testnet). Keep enough XLM for fees even when sponsorship is enabled.
3. Use the provisioned accounts:
   - **Alice** (`GDKSZHONN22WOJNQH4HCOJD6GYRW5VXGVQJUBXXHK5VR3VM4ITYG7NCY`): admin, donor, and merchant.
   - **Bob** (`GBFFXFVXFMAPP5E6JXTV4FVH6TUBXCIIXSZJBGJNCIIL4D6UPR2UMXHL`): verifier. This is a separate address from the admin and must not be the merchant for the claim it decides.
4. Alice added the AIDT trustline in [transaction `e092b260…`](https://stellar.expert/explorer/testnet/tx/e092b26009f87da791b9ec5af887a6fe99486a94f847d2aac9e65db973852a87) through **Aid → Live Testnet → Add AIDT Testnet trustline**. Alice now has `100.0000000 AIDT` for the walkthrough. The asset is `AIDT`, issuer `GAMYDV6WER7IKDXKMGDJEBINJNEZ22TYBGXPJQ5GJ7SA3EKQ2W36BE3A`; the token contract is `CCI6OVXBZKZTT2FUTZDBIYCXEG3J3T3SRZNWDHFI5NYVWPPUWWDIRJ4F`. `NEXT_PUBLIC_AID_CONTRACT_ID` already points to the hardened Aid contract. Restart `npm run dev` after pulling configuration changes.
5. Generate seven unique 64-character hexadecimal strings for the campaign ID, merchant profile hash, case ID, case-record hash, voucher ID, purpose hash, and evidence/reason values. They must be opaque random values—never names, URLs, photos, or beneficiary details.

> The UI currently submits lifecycle actions; initial contract deployment, token minting, and verifier provisioning are operator setup steps. This is deliberate: the contract, not browser copy, enforces authorization.

## 2. Start and connect

1. Run `npm run dev` and open the local URL.
2. Click **Connect Wallet**, choose Freighter, and approve the connection.
3. Confirm that the displayed `G...` address is the expected Testnet account and that an XLM balance is shown.
4. Switch to **Aid** in the bottom navigation. Start with **Local demo** to verify the UI before signing anything.

## 3. Test the local walkthroughs (no wallet transaction)

1. Click **Start clean walkthrough**.
2. Click **Advance walkthrough** twice.
3. Confirm the final state is `Paid`, `Reserved` is `0.00`, `Paid` is `25.00`, and history includes redemption then verifier approval.
4. Click **Start disputed walkthrough**.
5. Click **Advance walkthrough** four times.
6. Confirm the final state is `Rejected`, `Reserved` is `0.00`, the funds returned to `Available`, and history includes redemption, admin freeze, evidence revision, and verifier rejection.
7. Click **Reset demo** and confirm no activity remains. Nothing in this section is on-chain.

## 4. Test the clean Testnet delivery flow

1. Change Aid workspace mode to **Live Testnet**.
2. With the **admin** wallet connected, enter the campaign ID and token address, then click **Create live campaign**. Approve the wallet signature and save the success transaction hash.
3. Enter the campaign ID and a small funding amount. Disconnect, connect the **donor** wallet, then click **Fund campaign**. Approve and save the hash.
4. Disconnect and reconnect the **admin** wallet. Enter the merchant address/profile hash and click **Approve merchant**. Enter the campaign, case ID, and case-record hash and click **Create beneficiary case**.
5. Enter the voucher ID, purpose hash, merchant address, a small voucher amount no greater than campaign funding, and category. Click **Issue voucher**. Save every hash.
6. Disconnect and connect the assigned **merchant** wallet. Enter the voucher ID, a fresh initial evidence digest, and opaque evidence record ID. Click **Redeem voucher with evidence[0]**.
7. Disconnect and connect the **verifier** wallet. Enter the voucher ID and a fresh verifier decision reason digest. Click **Verifier approve / atomic payout**.
8. Confirm the success message includes a Testnet transaction hash. In Stellar Expert, confirm the payout went to the merchant account. Repeating the approval must fail without another payout.

### Verified Testnet run — 2026-08-19

A clean delivery flow was independently checked on-chain with Alice as admin/donor/merchant and Bob as verifier:

- Campaign creation: `1878c8b802969a8efe1f4dc2f14b60e5a37dfbf68ceea46ee521dd53b0c2dbb9`
- Funding (`10 AIDT`): `185d2222ac478068d2573892bfeb1f90b5be1e71fc6b27ff34e7276924c943eb`
- Merchant approval: `f8f3a0348953b1e6bbdf32827996b848ed8d579f98c567f4ab35f52fe6045892`
- Case creation: `7f5a696e8d5ed0c8596a438f3e379b793ac06e58850b8f13012938fbbb497838`
- Voucher issuance (`2 AIDT`): `14a8800382ee7648b2edf6dc8c880cc96a8b44f31ee25bc9e61e51c264b8b11e`
- Merchant redemption: `86bcdd8987428934be7f9800468c5b6d3c041f83694caa4763b226fb57d87a2b`
- Verifier approval: `ecfeef0f7ee193dc5b707be33fceb0cbd99d4c5f09a7fa72d01b5ca07510454c`

Final state: voucher `Paid`; campaign `8 AIDT` available, `2 AIDT` paid, no reservation; Alice's AIDT balance `92`.

## 5. Test the disputed Testnet delivery flow

1. With the admin, issue a **new** voucher using fresh voucher/purpose IDs.
2. With the merchant, redeem it using fresh evidence[0] digest and record ID.
3. With the admin, enter that voucher ID and a fresh freeze reason digest, then click **Admin freeze claim**.
4. With the merchant, enter fresh evidence revision digest and record ID, then click **Append exactly one evidence[1] after freeze**.
5. With the verifier, enter a fresh decision reason digest and click **Verifier reject / release reservation**.
6. Confirm the merchant received no payout and the reservation was released. A second revision or second decision must fail.

## 6. Required negative checks

1. Try an admin action while connected as a donor or merchant: it must fail with an authorization error.
2. Try a verifier decision while connected as admin: it must fail. Admin and verifier authority cannot share an address.
3. If a verifier is also approved as a merchant, have that address redeem its own voucher, then try approval: it must fail with the self-approval guard. Use a different verifier to resolve that claim.
4. Enter an invalid digest (anything other than 64 hexadecimal characters) and submit: the browser must show a recoverable validation error before a wallet signature.
5. Cancel a wallet signature once and confirm the app reports a recoverable rejection rather than treating it as success.

## 7. Evidence for the 10-user validation cohort

1. Collect consent and a transaction hash from at least 10 distinct Testnet participants.
2. Ensure the cohort includes donor, admin/operator, merchant/cooperative, and verifier interactions. Participants may contribute to multiple flow types.
3. Do **not** reuse an admin as a verifier or let a verifier decide a claim assigned to that verifier's merchant address.
4. Publish only aliases, dates, hashes, and aggregate counts. Keep any contact/consent sheet private.
5. Record the clean and disputed transaction chains, screenshots without personal data, and a short feedback summary.
