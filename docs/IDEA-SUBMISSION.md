# Aethyr — Idea Submission

> Stellar Journey to Mastery — Builder Track  
> Question 1 [Essay]: What is your idea?

---

Aethyr: A Cross-Border Payment App for Freelancers on Stellar

1. Problem Statement

I'm from the Philippines and I see this problem firsthand. A lot of Filipino freelancers work with clients abroad, and every time they get paid through PayPal or Payoneer, they lose around 5 to 8 percent of their earnings to fees and hidden currency conversion markups. On a $500 project, that's roughly P2,000 gone before the money even hits your GCash. And if you're working direct contracts outside Upwork or Fiverr, there's no escrow protection either, so you're basically trusting the client not to ghost you after you deliver. Aethyr is my attempt to fix this by routing freelancer payments through Stellar so they actually keep most of what they earn.

2. Why Stellar?

Stellar already has the infrastructure that makes this work. It has a network of anchors like MoneyGram, Coins.ph, and Anclap that handle the actual fiat on-ramps and off-ramps, which is the hard part that other blockchains don't have. It also has native path payments that can find the cheapest route to convert currencies in one transaction, which is exactly what a payment routing app needs. On top of that, Soroban lets me build escrow contracts with built-in compliance features like trustlines and clawback, which matters because this eventually needs to work with real regulated money. And the transaction fees are basically zero (0.00001 XLM per transaction), so the whole business model of charging way less than PayPal actually works.

3. Target Users

My main target is Filipino and Southeast Asian freelancers who get paid by international clients. The Philippines has over 1.5 million people registered on freelancing platforms, and most of them cash out through GCash or Maya. The secondary users are the clients paying them. The cool part is clients don't need to sign up for Aethyr. They just click a payment link, connect their wallet, and pay. For getting my first users, I plan to start with people I know and Filipino freelancer communities on Reddit and Facebook.

4. Technical Architecture

Aethyr is a mobile-first PWA built with Next.js and Tailwind, connected to Stellar through StellarWalletsKit. I'm building around 4 Soroban smart contracts: a Router that finds the best payment path, an Escrow contract for milestone-based payments, an Invoice Registry where freelancers create shareable payment links, and a Reputation Token that records completed jobs on-chain. The basic flow is: freelancer makes an invoice, client pays through the link, the Router finds the cheapest conversion route, funds go through escrow if there are milestones, and then the freelancer cashes out to local currency through the SEP-24 anchor flow. I already have the Router and Escrow contracts deployed on testnet with 70 passing tests.

5. Complexity Evaluation

The hardest part is getting the 4 contracts to talk to each other properly. The Router needs to call the Escrow, Invoice, and Reputation contracts in one atomic transaction, and if any step fails the whole thing has to roll back. The Reputation Token is also non-trivial since it's a soul-bound (non-transferable) token with custom metadata per mint, not a standard token. And the pathfinding engine has to combine data from three different sources (Horizon API, Soroban AMM reserves, and anchor rate quotes) and normalize them into one comparison.

6. Roadmap

For MVP (late July to early August), I'm building the Invoice and Reputation contracts, setting up a reference SEP-24 anchor flow, and getting 10 testnet users. By mid-August, I want to hit 50 users by reaching out to more freelancer communities, add recurring payments based on user feedback, and put together a pitch deck. By end of August, the goal is to deploy on mainnet, get 20+ real users transacting, and set up a project Twitter account. Long-term, I want to partner with local anchors like Coins.ph for real fiat cash-out and eventually expand to other countries.
