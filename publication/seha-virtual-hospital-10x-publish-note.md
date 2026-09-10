# Publication gate

This package intentionally remains on `publish/seha-virtual-hospital-10x` until the two article-index files are updated without destructive whole-file replacement. The repository connector currently exposes whole-file replacement rather than a safe patch operation for those large index files, so the cards are staged in `seha-virtual-hospital-10x-index-patch.html` rather than risking loss of existing cards/content.

This is a tooling constraint, not permission to bypass the gate. Do not merge until the index integration is complete.
