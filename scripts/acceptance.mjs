/** Acceptance is intentionally stricter than a source-level checklist. */
export function auditInventory(requiredIds, rows) {
  const defects=[];
  if(!Array.isArray(requiredIds)||new Set(requiredIds).size!==requiredIds.length||requiredIds.length===0)throw Error('Invalid canonical identifier inventory');
  if(!Array.isArray(rows))throw Error('Invalid feature inventory');
  const index=new Map();
  for(const row of rows){if(!row||typeof row.id!=='string'){defects.push('Invalid feature row');continue;}if(index.has(row.id))defects.push(`Duplicate feature ${row.id}`);index.set(row.id,row);}
  for(const id of requiredIds){const row=index.get(id);if(!row){defects.push(`Missing feature ${id}`);continue;}
    if(!row.title||!row.reason)defects.push(`Missing description ${id}`);
    if(!['incomplete','partial','verified','not-applicable'].includes(row.status))defects.push(`Invalid status ${id}`);
    if(row.status==='verified'){
      for(const kind of ['implementation','documentation','localization','test','interaction','capture'])if(!row.evidence?.some(e=>e.kind===kind&&typeof e.path==='string'&&e.path.length>0&&typeof e.sourceCommit==='string'&&/^[a-f0-9]{40}$/.test(e.sourceCommit)))defects.push(`Missing ${kind} evidence ${id}`);
    }
    if(row.status==='not-applicable'&&!row.applicabilityReview)defects.push(`Missing applicability review ${id}`);
  }
  for(const id of index.keys())if(!requiredIds.includes(id))defects.push(`Unknown feature ${id}`);
  return {valid:defects.length===0,complete:defects.length===0&&rows.every(r=>['verified','not-applicable'].includes(r.status)),defects,counts:rows.reduce((a,r)=>(a[r.status]=(a[r.status]||0)+1,a),{})};
}
