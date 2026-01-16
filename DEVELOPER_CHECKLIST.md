# 🔍 Developer Pre-Submission Checklist

**Copy this checklist to your PR description. Complete all items before requesting review.**

---

## 📋 Code Quality

### Linting & Build
- [ ] `npm run lint` passes with no errors
- [ ] `npm run build` completes successfully  
- [ ] No TypeScript errors (if applicable)
- [ ] No console.log() or debug code left

### Code Standards
- [ ] Uses KOB branding only (never "KOB-react" or "kob-react")
- [ ] No hardcoded UI strings (all use `t('key.path')`)
- [ ] No hardcoded contact info (uses `t('common.contact_email')`, etc)
- [ ] Follows existing code style & patterns
- [ ] Components properly documented with comments
- [ ] No unused imports or variables

---

## 🌍 Localization (MANDATORY)

- [ ] All new UI text added to `/locales/en.json`
- [ ] English strings translated to `/locales/ha.json`
- [ ] English strings translated to `/locales/ar.json`
- [ ] Translation keys follow naming convention: `feature.component.text`
- [ ] Tested in English (en) - Default language
- [ ] Tested in Hausa (ha) - Switch via LanguageSwitcher
- [ ] Tested in Arabic (ar) - Switch via LanguageSwitcher
- [ ] All three languages display without text overflow

---

## 📧 Contact Information

- [ ] Email uses: `t('common.contact_email')` → `bsanidatatech@gmail.com`
- [ ] Phone uses: `t('common.contact_phone')` → `07089454544`
- [ ] WhatsApp link uses: `t('common.contact_whatsapp_link')` → `https://wa.me/2347089454544`
- [ ] No placeholder values like `support@kob.example`
- [ ] Footer shows correct contact info in all languages
- [ ] Contact page has live, functional links

---

## 🔗 External Forms

If linking to Google Forms:
- [ ] Verified Seller: https://docs.google.com/forms/d/e/1FAIpQLSfFfwnt78a-GnE7g8HTpY8MrcFz2K_WjPjLhPCQPAWoUi6muA/viewform
- [ ] Express Delivery: https://docs.google.com/forms/d/e/1FAIpQLSc5Ml7GWZNeNzKhbiqwfULxtFiQUQ0Cgt9eAM2is4JKou3F1Q/viewform
- [ ] Rider/Agent: https://docs.google.com/forms/d/e/1FAIpQLSdM7A__EUQPG0N-W_NNFEMQrZHLjqo7UjZ3JJItr1qnc1h8Iw/viewform
- [ ] Forms NOT rebuilt locally (using external Google Forms only)
- [ ] Links open in new tab (`target="_blank"`)
- [ ] Links have proper rel security (`rel="noopener noreferrer"`)

---

## 🛡️ Security & Environment

- [ ] No secrets committed (API keys, tokens, credentials)
- [ ] All env variables prefixed with `VITE_` or stored in `.env.local`
- [ ] `.env.local` is in `.gitignore` ✓
- [ ] Firebase config is in `firebase.js`, not hardcoded
- [ ] Cloudinary credentials not exposed
- [ ] No sensitive logs in console

---

## 📱 Responsive Design

- [ ] Mobile view tested (375px - iPhone SE)
- [ ] Tablet view tested (768px - iPad)
- [ ] Desktop view tested (1920px - Large monitor)
- [ ] Touch targets are >= 44px (mobile accessibility)
- [ ] Text is readable at all breakpoints
- [ ] Images don't overflow on mobile

---

## 🧪 Functionality Testing

### Authentication
- [ ] Login flow works end-to-end
- [ ] Register flow works for both buyer & seller
- [ ] Logout clears user session properly
- [ ] Protected routes redirect correctly

### Marketplace
- [ ] Products load without errors
- [ ] Filtering works (by category, price, search)
- [ ] Product cards display correctly
- [ ] No XSS vulnerabilities (sanitized inputs)

### Error Handling
- [ ] Network errors show user-friendly messages
- [ ] Form validation provides clear feedback
- [ ] Loading states display properly
- [ ] Error boundaries catch unhandled exceptions

---

## 🎨 UI/UX

- [ ] Color scheme matches KOB branding (#C5A059, #2D1E17, #D4AF37)
- [ ] Fonts are consistent across pages
- [ ] Spacing & padding are uniform
- [ ] No broken links
- [ ] Buttons have hover/active states
- [ ] Forms have proper focus states (accessibility)

---

## 📄 Documentation

- [ ] README updated if new features added
- [ ] Component comments explain purpose & usage
- [ ] Complex logic has inline comments
- [ ] Breaking changes documented
- [ ] API changes documented in code

---

## 🚫 Anti-Patterns to Avoid

- [ ] ❌ NO: `const email = "support@kob.example"`  
      ✅ YES: `const email = t('common.contact_email')`

- [ ] ❌ NO: `"Welcome to KOB-react"`  
      ✅ YES: `t('home.welcome_message')`

- [ ] ❌ NO: `const phone = "07089454544"`  
      ✅ YES: `const phone = t('common.contact_phone')`

- [ ] ❌ NO: `fetch(process.env.API_KEY)`  
      ✅ YES: Stored in `firebase.js` safely

- [ ] ❌ NO: Feature without i18n support  
      ✅ YES: All UI text in locale files

---

## 🔄 Review Readiness

- [ ] PR title is descriptive: `feat(contact): use i18n for contact info`
- [ ] PR description explains changes clearly
- [ ] No merge conflicts with `main`
- [ ] Commits are logically grouped
- [ ] Commit messages follow format: `type(scope): message`
- [ ] No commits with message "fix" or "update"

---

## ✅ Final Check

**Before clicking "Create Pull Request":**

```bash
# Run these commands locally
npm run lint          # ← Should pass
npm run build         # ← Should succeed
```

**Then verify:**
- [ ] All checklist items above are completed
- [ ] You've tested all three languages
- [ ] You've tested on mobile & desktop
- [ ] You've reviewed your own code first
- [ ] No debug code or console.logs remain

---

## 📝 Example PR Description

```markdown
## Description
Updates Contact page to use centralized i18n system and correct contact information.

## Changes
- Replaced hardcoded email `support@kob.example` with `t('common.contact_email')`
- Replaced hardcoded WhatsApp link with `t('common.contact_whatsapp_link')`
- Added contact info translations to all three languages (en, ha, ar)
- Updated Footer component to use i18n for brand description

## Testing
- Tested in English, Hausa, and Arabic
- Verified links work correctly
- Mobile (iPhone SE 375px) ✓
- Desktop (1920px) ✓
- Contact info displays correctly

## Checklist
- [x] Code passes lint
- [x] Build succeeds
- [x] All UI text uses i18n
- [x] Tested in all 3 languages
- [x] Mobile & desktop verified
```

---

**Questions? Check [CONTEXT.md](../CONTEXT.md) for detailed guidelines.**

**Last Updated:** January 15, 2026
