# Aethyr Aid — Idea Submission

> Stellar Journey to Mastery — Builder Track  
> Question 1 [Essay]: What is your idea?

---

Aethyr Aid — Transparent Typhoon Relief Payments on Stellar

1. Problem Statement

My province Bicol in the Philippines gets hit by typhoons harder than most. During Typhoon Kristine in October 2024, our entire town Bato, Camarines Sur was submerged. My brother and my father were there for a visit and they were stranded there for several days. Families lost homes and were waiting for government shelter aid that took months to show up. This isn't a one-off. According to the COA's 2024 audit of the DHSUD Integrated Disaster Shelter Assistance Program (IDSAP), relief routinely takes 59 to 186 days to reach victims because of paper-based beneficiary lists, manual processing, and bureaucratic bottlenecks. Millions of pesos in relief funds end up unspent or rot in warehouses because nobody on the ground can verify who actually needs what. Even well-run relief drives hit this wall: after Typhoon Kristine, the Naga City government published a relief summary that underreported the Angat Buhay Foundation's actual distributions by orders of magnitude, and the only resolution was taking the post down. When basic questions like "how much aid went where" turn into he-said-she-said disputes, it shows how badly relief needs a shared, tamper-proof ledger for fund flows. Meanwhile, local sari-sari stores and hardware shops that supply rebuilding materials face months of delayed payments from local government units. Aethyr Aid is my attempt to fix this. It's a milestone-gated relief protocol on Stellar where funds go directly to verified merchants and victims, with less money lost to middlemen.

2. Why Stellar?

Stellar is a natural fit because of its anchor network. Platforms like Coins.ph and MoneyGram already connect Stellar to Philippine wallets like GCash and Maya, so the system can plug into existing payment rails without building new ones. The existing Stellar Aid Assist platform proves blockchain-based aid disbursement works, but it only does one-way cash handouts without any on-chain verification of how funds are actually spent. Aethyr Aid adds a layer on top: Soroban smart contracts that lock relief funds in phased escrows (Phase 1: Emergency Food and Medicine, Phase 2: Rebuilding Materials), where funds only release when on-ground verifiers confirm delivery. Stellar's near-zero transaction fees (0.00001 XLM) also make micro-voucher disbursements practical at scale because you can issue hundreds of small payouts to individual merchants without the fees eating into the aid budget.

3. Target Users

The primary users are international donors, NGOs, and Overseas Filipino Workers (OFWs) who want to fund typhoon recovery and actually know where the money went. The secondary users are local victims and registered supply merchants like groceries, hardware stores, and pharmacies who fulfill relief orders on the ground. Victims and merchants don't need to understand crypto at all. The dApp issues relief vouchers that cash out to their existing GCash or Maya accounts through Stellar anchors behind the scenes. Naga City in Bicol is the ideal starting point: Mayor Leni Robredo's administration has made transparent governance a priority with anti-corruption executive orders and whistleblower protections, which means there's already institutional appetite for accountability tools like Aethyr Aid. I'd pilot with local disaster response volunteer groups and developer communities there first.

4. Technical Architecture

Aethyr Aid is a mobile-first PWA built with Next.js and Tailwind CSS, connected to Stellar via StellarWalletsKit. I already built and deployed 2 Soroban contracts on testnet: a Router contract that finds the cheapest token conversion path across multiple hops (4 passing Rust tests), and an Escrow contract that locks funds with milestone-based release logic including dispute handling and auto-release after 7 days (7 passing Rust tests). The frontend has 59 passing Vitest tests covering wallet connections, transaction flows, and UI components. Here's how it works: a donor deposits funds into a milestone escrow through the Router, the Router converts tokens along the cheapest path, verifiers approve each milestone phase, and the Escrow releases funds to the destination. In production, Stellar anchors would handle the final cash-out to vendor GCash or Maya accounts.

5. Complexity Evaluation

The hardest part is verifying who actually needs help without any centralized database. In Philippine disaster zones, barangay-level beneficiary lists are handwritten, often duplicated across agencies, and hard to audit after the fact. The idea is to have on-chain verification where relief organizations register verified beneficiaries and merchants by wallet address, and the escrow contract gates milestone releases against this registry. The other big challenge is last-mile cash-out, which means integrating with platforms like Coins.ph so that merchants receive funds directly in GCash without ever touching crypto or needing a Stellar wallet. On top of that, the escrow needs to enforce that only registered merchants can claim milestone payouts, only authorized verifiers can approve releases, and only the original donor can trigger refunds. All of that is managed through Soroban's require_auth() system.

6. Roadmap

For Level 4 Green Belt (late July to early August), I am building a Voucher Registry contract where local merchants register supply capabilities and pricing, integrating the SEP-24 interactive anchor deposit and withdrawal flow, and adding SEP-38 quote API support for real-time fiat conversion rates. Target: 10 testnet users. For Level 5 Blue Belt (mid-August), I will add a Proof-of-Impact Token contract that mints non-transferable receipts showing donors exactly where their funds went, scale to 50 testnet users through Bicol community outreach, and put together a pitch deck. For Level 6 Black Belt (end of August), the goal is deploying on Stellar Mainnet, running a security review on all contracts, reaching 20+ real users, and launching a project Twitter account. Down the line, I want to partner with local platforms like Coins.ph to pilot this during the next typhoon season.
