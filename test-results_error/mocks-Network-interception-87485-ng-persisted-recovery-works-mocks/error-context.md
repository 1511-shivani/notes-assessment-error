# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\mocks\mocks.spec.ts >> Network interception and mocking >> M3 | Failed create/update >> 500 on create: UI does not claim success, nothing persisted, recovery works
- Location: tests\mocks\mocks.spec.ts:117:5

# Error details

```
Test timeout of 60000ms exceeded.
```

# Page snapshot

```yaml
- generic [ref=e1]:
  - paragraph [ref=e3]:
    - link "PMP Practice" [ref=e4] [cursor=pointer]:
      - /url: https://pmp.expandtesting.com/
    - text: "| Free PMP Certification Mock Exam Test +900 Questions & Quizzes"
    - link "Software testing courses" [ref=e5] [cursor=pointer]
  - banner [ref=e10]:
    - navigation "Main navigation" [ref=e11]:
      - link "SUT" [ref=e12] [cursor=pointer]:
        - /url: /
        - 'img "Best Website for Practice Automation Testing: Free UI and REST API Examples and Apps. Using Cypress, Playwright, Selenium, WebdriverIO and Postman." [ref=e13]'
        - text: Practice
      - generic [ref=e14]:
        - list [ref=e15]:
          - listitem [ref=e16]:
            - button "Demos" [ref=e17] [cursor=pointer]
          - listitem [ref=e18]:
            - link "Tools" [ref=e19] [cursor=pointer]:
              - /url: /#tools
          - listitem [ref=e20]:
            - link "Tips" [ref=e21] [cursor=pointer]:
              - /url: /tips
          - listitem [ref=e22]:
            - link "Test Cases" [ref=e23] [cursor=pointer]:
              - /url: /test-cases
          - listitem [ref=e24]:
            - link "API Testing" [ref=e25] [cursor=pointer]:
              - /url: /notes/api/api-docs/
          - listitem [ref=e26]:
            - link "About" [ref=e27] [cursor=pointer]:
              - /url: /about
        - list
        - link "Free ISTQB Mock Exams" [ref=e28] [cursor=pointer]:
          - /url: https://istqb.expandtesting.com/
  - main [ref=e29]:
    - paragraph [ref=e34]:
      - text: Do you enjoy this platform? ❤️
      - link "Buy us a coffee" [ref=e35] [cursor=pointer]:
        - /url: https://www.buymeacoffee.com/expandtesting
    - generic [ref=e36]:
      - insertion [ref=e38]:
        - generic [ref=e41]:
          - heading "These are topics related to the article that might interest you" [level=2] [ref=e43]: Discover more
          - link "Automation practice platform" [ref=e44] [cursor=pointer]
          - link "Software testing courses" [ref=e49] [cursor=pointer]
          - link "API testing tools" [ref=e54] [cursor=pointer]
          - link "Automation testing guide" [ref=e59] [cursor=pointer]
          - link "API testing services" [ref=e64] [cursor=pointer]
          - link "Test case templates" [ref=e69] [cursor=pointer]
          - link "Selenium automation framework" [ref=e74] [cursor=pointer]
          - link "Try Cloud Tools" [ref=e79] [cursor=pointer]
      - generic [ref=e86]:
        - navigation "breadcrumb mb-2" [ref=e87]:
          - list [ref=e88]:
            - listitem [ref=e89]:
              - link "Practice" [ref=e90] [cursor=pointer]:
                - /url: /
            - listitem [ref=e91]:
              - text: /
              - link "Home - My Notes - The App for Automation Testing Practice" [ref=e92] [cursor=pointer]:
                - /url: /notes/app/
        - generic [ref=e96]:
          - navigation [ref=e99]:
            - generic [ref=e100]:
              - link "MyNotes" [ref=e101] [cursor=pointer]:
                - /url: /notes/app/
              - list [ref=e111]:
                - listitem [ref=e112]:
                  - link "Profile" [ref=e113] [cursor=pointer]:
                    - /url: /notes/app/profile
                - listitem [ref=e114]:
                  - button "Logout" [ref=e115] [cursor=pointer]
          - generic [ref=e117]:
            - generic [ref=e123]:
              - textbox "Search notes..." [ref=e124]
              - button "Search" [ref=e125] [cursor=pointer]
            - generic [ref=e126]:
              - generic [ref=e128]:
                - button "All" [ref=e129] [cursor=pointer]
                - button "Home•" [ref=e130] [cursor=pointer]
                - button "Work•" [ref=e131] [cursor=pointer]
                - button "Personal•" [ref=e132] [cursor=pointer]
              - button "+ Add Note" [ref=e134] [cursor=pointer]
            - dialog [ref=e135]:
              - generic [ref=e136]:
                - generic [ref=e137]:
                  - generic [ref=e138]: Add new note
                  - button "Close" [ref=e139] [cursor=pointer]
                - generic [ref=e140]:
                  - generic [ref=e141]:
                    - generic [ref=e142]:
                      - generic [ref=e143]: "Category:"
                      - combobox "Category:" [ref=e144]:
                        - option "Home" [selected]
                        - option "Work"
                        - option "Personal"
                    - generic [ref=e146]:
                      - checkbox "Completed" [ref=e147]
                      - generic [ref=e148]: Completed
                    - generic [ref=e149]:
                      - generic [ref=e150]: "Title:"
                      - textbox "Title:" [ref=e151]: Will fail 1794494008914-890419
                    - generic [ref=e152]:
                      - generic [ref=e153]: "Description:"
                      - textbox "Description:" [active] [ref=e154]: Description for Will fail 1794494008914-890419
                  - generic [ref=e155]:
                    - button "Create" [ref=e156] [cursor=pointer]
                    - button "Cancel" [ref=e157] [cursor=pointer]
            - generic [ref=e161]:
              - heading "You don't have any notes in all categories" [level=4] [ref=e162]
              - img "You don't have any notes in all categories" [ref=e163]
      - insertion [ref=e165]:
        - generic [ref=e168]:
          - heading "These are topics related to the article that might interest you" [level=2] [ref=e170]: Discover more
          - link "Try Dev Tools" [ref=e171] [cursor=pointer]
          - link "Browse Reference" [ref=e176] [cursor=pointer]
          - link "Secure Networks" [ref=e181] [cursor=pointer]
          - link "Audit Security" [ref=e186] [cursor=pointer]
          - link "WebdriverIO automation examples" [ref=e191] [cursor=pointer]
          - link "Learn to Code" [ref=e196] [cursor=pointer]
          - link "Source Robotics" [ref=e201] [cursor=pointer]
          - link "React development services" [ref=e206] [cursor=pointer]
  - contentinfo [ref=e211]:
    - generic [ref=e216]:
      - heading "Practice Test Automation WebSite for Web UI and Rest API" [level=4] [ref=e217]
      - paragraph [ref=e218]:
        - text: "Version: e64cd80e | Copyright"
        - link "Expand Testing" [ref=e219] [cursor=pointer]:
          - /url: https://expandtesting.com/
        - text: "2026"
        - link "Software testing courses" [ref=e220] [cursor=pointer]
  - generic [ref=e224] [cursor=pointer]
```