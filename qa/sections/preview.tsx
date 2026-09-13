import React from 'react';
import { createRoot } from 'react-dom/client';
import { Journey } from '../../src/components/journey/Journey';
import { Contact } from '../../src/components/contact/Contact';
import { PremiumEffects } from '../../src/components/common/PremiumEffects';
import { BackgroundAtmosphere } from '../../src/components/common/BackgroundAtmosphere';
import '../../src/index.css';
import '../../src/blueprint.css';
createRoot(document.getElementById('root')!).render(<div className="relative bg-[#050505] text-[#F5F5F5]"><BackgroundAtmosphere /><PremiumEffects /><main className="relative z-10 flex flex-col"><Journey /><Contact /></main></div>);
