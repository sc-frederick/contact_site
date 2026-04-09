from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 375, "height": 667})  # Mobile viewport
    page.goto("http://localhost:3001")
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(2000)  # Extra wait for JS

    # Check nav exists
    nav = page.locator("nav").first
    if not nav.is_visible():
        print("❌ No nav found")
        print("Body:", page.locator("body").inner_html()[:500])
        browser.close()
        exit(1)

    print("✅ Nav found")

    # Check hamburger button by aria-label
    hamburger = page.locator('button[aria-label*="menu" i]').first
    if not hamburger.is_visible():
        print("❌ Hamburger button not found")
        browser.close()
        exit(1)

    print("✅ Hamburger button found")

    # Click to open menu
    hamburger.click()
    page.wait_for_timeout(500)

    # Check menu opened
    expanded = hamburger.get_attribute("aria-expanded")
    if expanded != "true":
        print(f"❌ Menu should be open, but aria-expanded={expanded}")
        browser.close()
        exit(1)

    print("✅ Mobile menu opens")

    # Click to close menu
    hamburger.click()
    page.wait_for_timeout(500)

    expanded = hamburger.get_attribute("aria-expanded")
    if expanded != "false":
        print(f"❌ Menu should be closed, but aria-expanded={expanded}")
        browser.close()
        exit(1)

    print("✅ Mobile menu closes")

    browser.close()
    print("✅ Mobile menu functionality verified")
