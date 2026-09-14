# Evidence Pack — DEWA Automatic Smart Grid Restoration (ASGR)

**Case slug:** `case-dewa-asgr-self-healing-grid`  
**Review date:** 2026-09-14  
**Status:** Accepted with evidence limitations  
**Overall confidence:** 8.6/10

## Evidence threshold decision

The case passes the evidence threshold because the intervention is technically specific, the operating mechanism is documented in DEWA technical reports across multiple years, a quantitative operating result is published (`restoration time < 1 minute`), and independent IEEE/EPRI sources support the FLISR mechanism and its expected restoration logic. The case does **not** claim that ASGR alone caused DEWA's whole-network CML improvement because the CML trend predates the 2022 launch and no public independent evaluation isolates ASGR's causal contribution.

## Evidence Pack

| Claim | Number / result | Direct source | Source type | Confidence | Evidence limit / note |
|---|---|---|---|---|---|
| DEWA launched ASGR in June 2022 | Launch on 27 June 2022 | https://www.dewa.gov.ae/en/about-us/media-publications/latest-news/2022/06/dewa-launches | Primary official | High | Launch announcement does not disclose pilot duration or test cohort. |
| ASGR locates faults, isolates the affected section and restores service automatically | Documented operating function | Same 2022 launch source; DEWA Smart Grid Report 2025 | Primary official / technical | High | Does not mean physical repair of the failed asset. |
| FLISR/ASGR is part of a wider distribution-automation architecture | SCADA at 33/11/6.6kV substations; motorised RMUs; switching/crew management | https://www.dewa.gov.ae/-/media/Files/smartgrid/Smart-Grid_Report_2025_EN_Final.ashx | Primary technical report | High | Architecture is documented; detailed event-level performance data are not public. |
| Reported restoration time is below one minute | `< 1 minute` | DEWA Smart Grid Report 2025 | Primary technical report | High for the reported figure | No independent audit of the DEWA figure was found. Scope/denominator of restoration events is not publicly specified. |
| The 2026 operating description uses IEDs, RTUs and communications between substations and the control centre; affected feeders are isolated and restorable customers transferred to adjacent circuits | Operational mechanism | https://dewa.gov.ae/en/about-us/media-publications/latest-news/2026/6/dewa-adopts-an-advanced-smart-system-to-enhance | Primary official | High | Public source does not provide event counts, false-operation rate or coverage percentage. |
| DEWA's smart-grid strategy began in 2014 and was updated in 2021 to 2035, shifting from technology-led to value-driven | Strategy timeline | https://www.dewa.gov.ae/en/about-us/strategic-initiatives/smart-grid | Primary official | High | Strategic intent is not itself an outcome. |
| DEWA built foundational communications and automation before ASGR | Transmission automation 2015–2017; RF Mesh deployed in 2017 and expanded to 4,200+ distribution substations | https://dewa.gov.ae/en/about-us/media-publications/latest-news/2022/04/dewa-implements-its-smart-grid-strategy-2021-2035 | Primary official | High | These are enabling capabilities, not proof of ASGR effect. |
| Whole-network CML improved | 6.88 min (2012), 1.43 (2021), 1.19 (2022), 1.06 (2023), 0.94 (2024), 0.82 (2025) | https://dewa.gov.ae/en/about-us/strategy-excellence/world-class-results | Primary official KPI series | High for DEWA's published series | The trend starts long before ASGR; do not attribute the full improvement to ASGR. |
| FLISR/FDIR is a recognised self-healing distribution-grid approach | Peer-reviewed review of fault detection/location, isolation and service restoration | https://doi.org/10.1109/TSG.2016.2517620 | Independent academic / IEEE | High for mechanism | Does not evaluate DEWA. |
| A core FLISR objective is rapid restoration of healthy feeder sections, potentially within less than a minute | Industry technical description | https://restservice.epri.com/publicdownload/000000000001024360/0/Product | Independent professional / EPRI | High for mechanism | Does not validate DEWA's measured result. |
| European continuity-of-supply benchmarking uses indicators such as SAIDI/CML and shows material variation by jurisdiction and methodology | 39-country benchmarking context | https://www.ceer.eu/publication/7th-ceer-ecrb-benchmarking-report-on-the-quality-of-electricity-and-gas-supply/ | Independent regulator benchmark | High for comparison context | Does not audit DEWA or prove its global ranking. |

## What happened

DEWA built a distribution-automation capability in which ASGR operates within a FLISR architecture. When a distribution fault occurs, the system can identify the affected section, isolate it, and restore supply to healthy sections through alternative network paths when operating constraints allow.

## Intervention / transformation

The operating transformation is from a largely sequential restoration chain — detect, diagnose, decide, switch, restore — toward a closed-loop automated response for the first containment and restoration steps, supported by SCADA visibility, communications, intelligent devices, motorised switching equipment and distribution-control-centre logic.

## Actual documented results

1. DEWA Smart Grid Report 2025 reports restoration time of **less than one minute** for the FLISR/ASGR capability.
2. DEWA's whole-network **CML reached 0.82 minutes per customer in 2025**, down from 0.94 in 2024 and 1.06 in 2023.
3. The CML series is treated as a network-level result, not an ASGR-only result.

## Goal versus achieved result

- **Strategic goal:** a smart, interconnected, highly reliable network with automated decision-making and readiness for future demand.
- **Documented achieved operating result:** sub-one-minute restoration reported for the FLISR/ASGR capability.
- **Documented network outcome:** 0.82 CML in 2025.
- **Not established:** that ASGR alone caused the CML level or the full historical decline.

## Future-to-impact / backcasting chain

**Desired future** → distribution service that contains faults quickly and keeps healthy sections energised.  
**Required capabilities** → real-time visibility, reliable communications, controllable switching devices, network-state logic, safe operating rules, control-centre integration.  
**Build today** → SCADA, intelligent/remote terminal devices, motorised RMUs, communications, distribution-control-centre applications, operational data and governance.  
**Different way of working** → automatic isolation and reconfiguration for eligible fault scenarios instead of waiting for every switching step to be initiated manually.  
**Results and impact** → shorter restoration time for healthy sections and contribution to a highly reliable distribution system.

## Selected 10X pillars

1. **Future foresight and ambition** — supported by the 2035 smart-grid strategy and the explicit shift to value-driven capabilities.
2. **Leadership and future governance** — supported by the integration of automation with control-centre operations, switching procedures, field crews and safety constraints.
3. **Reinventing the operating model** — supported by the shift of fault isolation and restoration steps from sequential manual intervention into automated network action.
4. **Maximising institutional and technical intelligence** — supported by real-time data, communications, controllable devices and restoration logic acting as one operating capability.

Other pillars are not forced into the case because the public evidence does not require them.

# Company Insider Critique / نقد الخبير الداخلي

This is a simulated evidence-based critique from the perspective of a senior distribution-power leader; it is **not** a statement by DEWA and does not claim to represent DEWA.

## Main critique points

1. **Do not say the grid “repairs itself.”** ASGR isolates the faulted section and restores healthy sections; physical repair still requires operational and field work.
2. **Do not imply that “without human intervention” applies to the entire outage lifecycle.** It applies to the automated detection/isolation/restoration sequence described by DEWA, not to repair, safety, governance or every exceptional scenario.
3. **Do not attribute CML improvement solely to ASGR.** CML had already fallen materially before the 2022 launch, and DEWA also uses preventive maintenance, cable-health programmes, broader automation and other reliability measures.
4. **Explain the enabling architecture.** The story is incomplete without SCADA, communications, intelligent devices, RTUs and motorised RMUs; ASGR is an application inside a wider operating system.
5. **Clarify the sequence between launch and continued implementation.** The 2022 launch and 2026 description of current implementation are best read as launch followed by continued deployment/maturation, not as evidence of a four-year pilot.
6. **Do not invent pilot duration, test-cohort size or learning-cycle details.** The reviewed public sources do not disclose them.
7. **Do not treat “under one minute” as independently verified.** It is a DEWA-reported technical result; IEEE/EPRI support the mechanism's plausibility but do not audit DEWA.
8. **State what became possible operationally.** Operators and the grid can obtain real-time visibility, isolate a faulted section and restore eligible healthy sections through alternative paths faster than a fully sequential manual response would allow.

## Changes made because of the critique

- Replaced any implication of automated physical repair with the narrower, technically accurate concept of isolation plus restoration of healthy sections.
- Added a dedicated explanation of what “self-healing” does **not** mean.
- Separated the `< 1 minute` capability metric from the whole-network CML outcome.
- Added the pre-2022 CML trend to prevent causal overstatement.
- Added SCADA, FLISR, RMU, IED/RTU and communications as enabling layers rather than presenting ASGR as a standalone application.
- Added the 2014 → 2021 → 2022 → 2023/2025 → 2026 implementation timeline.
- Added an explicit public-evidence gap for pilot duration, feeder coverage, event counts, false-operation rate, restoration success rate and ASGR-attributable CML reduction.
- Reframed the 10X question around the desired future and backcasting to capabilities that must be built now.

## Remaining unverified gaps

- Initial pilot/testing duration and cohort size.
- Number or percentage of feeders currently covered by ASGR.
- Event-level denominator behind the `< 1 minute` restoration result.
- False-operation / failed-restoration rates and exceptional scenarios.
- Quantified workforce-productivity or truck-roll impact attributable to ASGR.
- Independent audit of the ASGR-specific outcome.
- Causal share of DEWA's CML improvement attributable to ASGR versus other reliability initiatives.

# Final Quality Gate

- Evidence threshold: **PASS with limitations**.
- Primary direct sources: **PASS**.
- Independent academic/professional sources: **PASS for mechanism/context; not direct outcome validation**.
- Quantitative result separated from corporate-wide KPI: **PASS**.
- Goal vs achieved result separated: **PASS**.
- Causal overstatement check: **PASS**.
- Technical terms defined on first use in the article: **PASS**.
- Future → capabilities → build today → different way of working → impact chain: **PASS**.
- Only evidence-supported 10X pillars used: **PASS**.
- Pilot/testing evidence: **PUBLIC GAP DISCLOSED**.
- Company Insider Critique completed and incorporated: **PASS**.
- Arabic/English substantive parity: **PASS**.
- SEO, canonical, hreflang, Open Graph, Twitter, Schema.org and breadcrumbs: **PASS in page source**.
- Preview-card factual claims: **PASS; no unsupported causal number used**.
- GitHub Pages exact-head deployment: **must be verified separately before declaring Live**.
