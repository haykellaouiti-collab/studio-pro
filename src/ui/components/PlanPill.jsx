import React from 'react';
export default function PlanPill({ isCreator }) {
  return <span className={isCreator ? 'pill creator' : 'pill'}>{isCreator ? 'Plan Creator' : 'Plan Gratuit'}</span>;
}
