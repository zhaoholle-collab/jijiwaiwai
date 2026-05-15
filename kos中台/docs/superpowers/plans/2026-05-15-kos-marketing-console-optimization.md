# KOS Marketing Console Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the existing KOS single-file demo into a tighter marketing workflow prototype with simplified navigation, richer creation flow, a public lead pool, follow-up tasks, and stronger AI planning/wake-up surfaces.

**Architecture:** Keep the current static React-in-HTML architecture and extend it in place. Add a small Node-based structural test that reads the HTML and checks for the required UI labels and removed standalone entries.

**Tech Stack:** Static HTML, React 18 UMD, Arco Design Web React CSS/JS CDN, plain CSS, Node.js built-in test runner.

---

### Task 1: Add Structural Regression Test

**Files:**
- Create: `tests/kos-demo-structure.test.mjs`

- [ ] **Step 1: Write the failing test**

Create a Node test that reads `KOS中台管理页面.html` and asserts:
- side navigation no longer includes standalone `写作模板` or `人设工作台`
- the source includes `发企微计划书`
- the source includes `潜客公海池`, `跨平台查重`, `转为企业好友`
- the source includes `跟进任务`, `10分钟`, `3小时`, `24小时`
- the source includes `意向分组成` and `话术卡片快捷发送`

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/kos-demo-structure.test.mjs`
Expected: fail because the new public pool/follow-up/task labels are missing or standalone navigation remains.

### Task 2: Implement HTML Demo Changes

**Files:**
- Modify: `KOS中台管理页面.html`

- [ ] **Step 1: Update navigation and creation center**

Remove standalone side-nav entries for `写作模板` and `人设工作台`, add in-page chips/links inside `创作中心`, and add the `发企微计划书` quick task.

- [ ] **Step 2: Strengthen topic/data/publish/inbox closures**

Add clearer CTA wording for `灵感岛 → AI生图/创作中心`, make data board viral actions say they can fill the creation center, and add visible inbox wake-up gradient labels, score composition, and quick speech cards.

- [ ] **Step 3: Add public lead pool page**

Replace the placeholder for `clients` with a `ClientsPage` showing high-intent leads, public-pool nurture leads, cross-platform duplicate markers, source paths, KYC/behavior fields, and one-click enterprise friend conversion.

- [ ] **Step 4: Add follow-up tasks page**

Replace the placeholder for `follow` with a `FollowPage` showing 10-minute, 3-hour, and 24-hour wake-up stages, task statuses, and next actions.

### Task 3: Verify

**Files:**
- Test: `tests/kos-demo-structure.test.mjs`

- [ ] **Step 1: Run structural test**

Run: `node --test tests/kos-demo-structure.test.mjs`
Expected: pass.

- [ ] **Step 2: Open locally**

Open the HTML in a browser or static file preview and verify the main pages render without obvious JSX syntax errors.
