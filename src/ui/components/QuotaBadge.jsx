import React from 'react';
export default function QuotaBadge({ isCreator, usedToday }) {
  return <span className="pill quota">{isCreator ? 'Exports : Illimités' : `Quota : ${Math.max(0, 1 - usedToday)}/1`}</span>;
}
