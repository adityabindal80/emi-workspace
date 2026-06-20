# EMI Workspace

A Next.js EMI Calculator with real-time shared workspace across browser tabs.

## Deployed URL (Live Demo)
https://emi-workspace.vercel.app

## GitHub Repository

https://github.com/adityabindal80/emi-workspace

## Features

- EMI calculator using reducing-balance formula
- Synced number inputs and sliders
- Monthly EMI, total interest, total payable
- Principal vs interest split visualization
- Amortization schedule with pagination
- Break-even month highlight
- Table/chart view toggle
- Loan comparison mode with 3 scenarios
- Lowest total payable highlight
- What-if sensitivity table
- Prepayment planner
- Cross-tab state sync using BroadcastChannel
- Active tab count using heartbeat presence
- Synced theme toggle
- CSV export for amortization schedule

## Tech Stack

- Next.js App Router
- React Hooks
- TypeScript
- Tailwind CSS
- Recharts
- BroadcastChannel API

## Run Locally

```bash
npm install
npm run dev