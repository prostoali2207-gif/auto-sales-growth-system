# Automotive Capture Direction — AM-001 Human Field Evidence

Date: 2026-09-03
Trackers: #37, #40
Upstream: `professional-ai-agents#229`, PR `#230`, field review tracker `professional-ai-agents#271`

## Verdict

**PRACTICAL EVIDENCE OBTAINED / NOT RELEASE-VALID AS THE PREREGISTERED FIELD GATE**

Primary classification: `LOCAL_EXECUTION_FAIL` — protocol-execution deviation. This is **not** a frozen-candidate professional failure.

The final media are valid real-world artifacts and the exact frozen Automotive Commercial Capture Direction capability directly observed and accepted all three. However, the original 2026-09-01 field-gate protocol cannot honestly be marked PASS because the live execution deviated from its preregistered trajectory constraints.

## Frozen candidate under review

- candidate commit: `6e34be04f1bc6912c95e5f6c0b34d1ccf9ccf13c`
- candidate blob: `6824ba3256ab6f3b51c5596f6fd6e42e013937f7`
- host digest: `sha256:ce5f537d336e6a6396f47c1ae492a687c4dc4b30ade8ab37bb4abb94d6251c0f`
- candidate mutation during this practical: none

## Actual field vehicle

`AM-001` — Toyota Yaris, model year 2026, White.

The original preregistration named AM-007 Hyundai Tucson 2024 Black. AM-007 and the planned alternative Sorento were not physically available for the field session, so the operator used the physically available AM-001. The authoritative vehicle sheet remained the source of identity facts.

## Final real artifacts

All three files are stored in the authoritative AM-001 Drive folder.

1. `F1_HERO_STILL_FINAL`
   - Drive file ID: `1KXYxWMpQlVJGOQuxNVUi84wmVggbSETr`
   - SHA256: `sha256:48a718443dfbf8a176da177222a57bcc994d393ef86b9ffe536193458e866d9a`
2. `F2_PROOF_STILL_FINAL`
   - Drive file ID: `10E-JBxkY3-E87TtRLIqObgsXfdDt57AC`
   - SHA256: `sha256:4ef7cb301835252ede06233e5236a43e3f3bcd6860ea2c25f1ebc03bd4271637`
3. `F3_BROLL_VIDEO_FINAL`
   - Drive file ID: `1n6T6CdJiz4URf-9FDgaWMedYxF3bq2vS`
   - SHA256: `sha256:f52fa3d6a9d52c5be28da93506703a670edfa84ddaa86d379f0b09bb0a34fe3e`

## Direct frozen-capability artifact review

Professional repo workflow:
- run: `33751234264`
- workflow: `Automotive Capture AM-001 field final review`
- head: `b2a8af310b6cb39c0ab63bc77bb9759919373a14`
- conclusion: `success`
- model: `gemini-3.5-flash-lite`
- candidate calls: 1
- judge calls: 0
- scored retries: 0
- media digests verified before the model call

Frozen capability decisions:
- `F1_HERO_STILL_FINAL` → `ACCEPT`
- `F2_PROOF_STILL_FINAL` → `ACCEPT`
- `F3_BROLL_VIDEO_FINAL` → `ACCEPT`

The capability reported no material reshoot issue on the final artifacts and marked the sources suitable for downstream editing.

## Human trajectory evidence

Useful observations from the real session:

- one non-professional operator physically executed the shoot on a phone;
- shade/open-sky placement materially improved the white-car rendering compared with harsh direct sun;
- proof side-profile capture was accepted without a reshoot;
- first B-roll take was rejected for excessive duration/end framing; the next take corrected the issue and was accepted;
- hero capture required multiple iterative framing corrections before acceptance;
- one live instruction sequence exposed a framing contradiction: stepping back on fixed `1x` while simultaneously demanding less floor/roof was not physically coherent; the operator identified the contradiction and the eventual correction changed orientation/framing rather than pretending distance alone could satisfy both constraints.

This is useful practical evidence for the interactive directing layer, but it must not be retroactively rewritten as a clean preregistered PASS.

## Why the original field gate cannot be marked PASS

1. Vehicle identity changed from preregistered AM-007 to AM-001 without a preregistration amendment before capture.
2. The preregistered test required the frozen capability to produce the operator packet before shooting. The actual live instructions came through the interactive chat/screen-share path rather than the exact frozen candidate runtime.
3. The preregistration allowed at most one instructed reshoot round; the hero path required more than one correction before the accepted final frame.
4. Therefore the final files prove useful source-media output, but the trajectory does not satisfy the frozen release protocol.

## Next action

Run one short fresh practical gate with the exact same frozen candidate but a preregistered execution mode that matches how the system will actually be used. Use fresh shot jobs/viewpoints so the accepted AM-001 samples are not simply replayed. The gate should explicitly freeze orientation/output destination before distance/framing commands and allow live pre-capture adjustment while retaining a maximum of one post-capture reshoot round.

Do not bind Automotive Commercial Capture Direction into production Content Creator until that clean practical gate plus targeted Content Creator composition regression pass.
