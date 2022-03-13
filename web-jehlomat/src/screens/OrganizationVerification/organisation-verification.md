# Organisation Verification

Organisation verification is the last part of the organisation registration flow.

The idea behind it, it to manually confirm organisation registration by the super admin. By manually means that the Super Admin will receive a confirmation link to their email and after visiting it, the organisation registration is confirmed.

```mermaid
sequenceDiagram
    actor User
    participant J as Jehlomat
    actor SuperAdmin

    User->>J: Organisation registration
    J->>SuperAdmin: Mail with the confirmation link
    SuperAdmin->>J: Visiting the link
    J->>J: Confirm the organisation registration
```

## Components hierarchy

The confirmation link redirects a super admin to the organisation verification page.
The component hierarhy looks next:

```mermaid
flowchart TB
    subgraph OrganizationVerificationScreen
      subgraph Layout
        subgraph OrganizationVerification
          Content
        end
      end
    end
```

1. OrganizationVefiricationScreen is the screen components represents the page
2. Layout is the common components to add the header and the footer to the page
3. OrganizationVerification is the business logic component.
4. Content is the view component.

## Business logic

The business logic of the organisation verification consists of the next phases:

1. Checking the user signed in
2. Request verification to the BE service
3. Render the payload to the user on the screen

```mermaid
sequenceDiagram
  actor JU as Jehlomat User
  participant VP as Verification Page
  participant BES as BE Service
  participant LP as Login Page

  JU->>VP: Visiting the verification link
  alt is not logged in
      VP->>LP: User is not logged in
      LP->>VP: Log in
  end
  VP->>BES: request organisation confirmation by id
  alt 200
      VP->>VP: Organization verification success
  else 404 or 204
      VP->>VP: Organisation verification failed: no organisation found
  else 403
      VP->>VP: Organisation verification failed: user does not have permission to verify organisation
  end
```