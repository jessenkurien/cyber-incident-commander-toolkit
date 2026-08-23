# Example: Executive Cyber Incident Update

**Incident:** SaaS token compromise (fictional exercise)  
**Severity:** SEV-1  
**Status:** Active — containment validation  
**As of:** 2026-08-23 14:00 PT  
**Next update:** 14:30 PT or material scope change

## Executive summary

We are responding to suspected unauthorized use of a privileged OAuth token affecting executive email access. Five accounts are under review; unauthorized access is confirmed for three, and no data exfiltration is currently confirmed. The application and known sessions are disabled, while teams validate containment and preserve evidence.

## Business impact

- Executive email access continues through a validated clean path.
- No critical customer-facing services are disrupted.
- Legal and Privacy are assessing accessible information and notification triggers.
- Confidence in the affected-account count is medium pending completion of mailbox and audit-log review.

## What changed

- The suspect OAuth application was disabled.
- Known active sessions were revoked.
- Identity and mailbox audit logs were preserved.
- Review expanded from three to five potentially affected accounts.

## Decision required

Approve revocation of all executive OAuth grants for reauthorization through the clean access process. This creates short-term productivity impact but reduces the risk of an unidentified persistent grant.

## Forward risk

The leading risk is an additional delegated mailbox or offline token not yet associated with the known application. IAM and DFIR are validating all executive grants and monitoring for renewed access.

> This is a fictional example for tabletop and portfolio use. It is not a report of a real incident.
