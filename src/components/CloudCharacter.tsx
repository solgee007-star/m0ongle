/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CloudStage } from '../types.ts';

interface CloudCharacterProps {
  stage: CloudStage;
  equippedClothes?: string | null;
  equippedAccessory?: string | null;
  expression?: 'happy' | 'peaceful' | 'cheer' | 'blink' | 'comfort';
  speechText?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showStageBadge?: boolean;
  onTap?: () => void;
  sparkle?: boolean;
}

export const CloudCharacter: React.FC<CloudCharacterProps> = ({
  stage,
  equippedClothes,
  equippedAccessory,
  expression = 'peaceful',
  speechText,
  size = 'md',
  showStageBadge = false,
  onTap,
  sparkle = false,
}) => {
  const [isBlinking, setIsBlinking] = useState(false);
  const [localExpression, setLocalExpression] = useState(expression);

  // Automatic gentle blink interval
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, 4500);

    return () => clearInterval(blinkInterval);
  }, []);

  useEffect(() => {
    setLocalExpression(expression);
  }, [expression]);

  const handleCharacterClick = () => {
    // Temporary happy wiggle on tap
    setLocalExpression('happy');
    setTimeout(() => setLocalExpression(expression), 1800);
    if (onTap) onTap();
  };

  const getStageTitle = (s: CloudStage) => {
    switch (s) {
      case 1:
        return '아기 구름';
      case 2:
        return '작은 구름';
      case 3:
        return '큰 구름';
      case 4:
        return '무지개 구름';
    }
  };

  const dimensions = {
    sm: 'w-24 h-24',
    md: 'w-36 h-36',
    lg: 'w-48 h-48',
    hero: 'w-64 h-64',
  }[size];

  return (
    <div className="relative flex flex-col items-center select-none">
      {/* Speech Bubble */}
      {speechText && (
        <div className="relative mb-3 max-w-[280px] bg-white/95 px-4 py-2.5 rounded-2xl shadow-sm border border-emerald-100 text-center text-xs sm:text-sm font-medium text-emerald-950 leading-relaxed animate-gentle-float">
          {speechText}
          <div className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 w-3 h-3 bg-white border-b border-r border-emerald-100 rotate-45" />
        </div>
      )}

      {/* Cloud SVG Container */}
      <div
        onClick={handleCharacterClick}
        role="button"
        tabIndex={0}
        aria-label={`몽글이 (${getStageTitle(stage)}) - 터치하면 반응해줘`}
        className={`relative ${dimensions} cursor-pointer transition-transform duration-300 active:scale-95 animate-gentle-float flex items-center justify-center`}
      >
        {/* Floating Coin / Sparkle Pop effect */}
        {sparkle && (
          <div className="absolute -top-4 text-amber-500 font-bold text-sm animate-coin-sparkle pointer-events-none z-30">
            ✨ +마음 코인
          </div>
        )}

        <svg
          viewBox="0 0 200 170"
          className="w-full h-full drop-shadow-[0_8px_16px_rgba(100,160,120,0.14)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Soft Cloud Gradient */}
            <linearGradient id="cloudGrad" x1="100" y1="20" x2="100" y2="160" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFFFFF" />
              <stop offset="0.7" stopColor="#F4FAF5" />
              <stop offset="1" stopColor="#E2F0E6" />
            </linearGradient>

            {/* Rainbow Glow for Stage 4 */}
            <linearGradient id="rainbowAura" x1="0" y1="0" x2="200" y2="170" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FCA5A5" stopOpacity="0.4" />
              <stop offset="0.25" stopColor="#FDE047" stopOpacity="0.4" />
              <stop offset="0.5" stopColor="#86EFAC" stopOpacity="0.4" />
              <stop offset="0.75" stopColor="#93C5FD" stopOpacity="0.4" />
              <stop offset="1" stopColor="#D8B4FE" stopOpacity="0.4" />
            </linearGradient>

            {/* Stage 3 Golden Warm Aura */}
            <radialGradient id="stage3Glow" cx="50%" cy="50%" r="50%">
              <stop stopColor="#FEF08A" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#FEF08A" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Stage 4 Rainbow Aura Ring */}
          {stage >= 4 && (
            <ellipse
              cx="100"
              cy="95"
              rx="90"
              ry="55"
              fill="url(#rainbowAura)"
              className="animate-gentle-pulse-slow filter blur-md"
            />
          )}

          {/* Stage 3 Warm Glow Aura */}
          {stage === 3 && (
            <ellipse
              cx="100"
              cy="95"
              rx="85"
              ry="50"
              fill="url(#stage3Glow)"
              className="animate-gentle-pulse-slow filter blur-sm"
            />
          )}

          {/* Main Cloud Body Geometry depending on stage */}
          <g>
            {stage === 1 ? (
              // Baby Cloud (Compact, round & tiny cute bumps)
              <path
                d="M50 115 C35 115 25 102 28 88 C30 76 40 70 52 72 C58 55 76 45 95 48 C115 50 128 65 128 78 C140 78 152 86 150 100 C148 112 138 116 126 115 Z"
                fill="url(#cloudGrad)"
                stroke="#CDE6D5"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
            ) : stage === 2 ? (
              // Little Cloud (Bigger side puffs, more plump)
              <path
                d="M45 125 C25 125 15 108 20 90 C24 76 38 68 52 70 C58 50 80 38 102 42 C124 45 138 62 138 78 C155 78 170 88 168 108 C166 122 152 126 138 125 Z"
                fill="url(#cloudGrad)"
                stroke="#B8DFC3"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
            ) : (
              // Big & Rainbow Cloud (Fully rounded puffs, majestic fluffy outline)
              <path
                d="M40 130 C18 130 8 110 14 88 C18 72 34 64 50 66 C58 42 84 28 110 32 C134 36 150 56 150 74 C168 74 188 86 186 108 C184 126 168 131 150 130 Z"
                fill="url(#cloudGrad)"
                stroke={stage >= 4 ? '#A7F3D0' : '#A3D9B0'}
                strokeWidth="2.8"
                strokeLinejoin="round"
              />
            )}
          </g>

          {/* Soft Rosy Cheeks */}
          <ellipse
            cx={stage === 1 ? '58' : '62'}
            cy={stage === 1 ? '96' : '98'}
            rx="7"
            ry="4.5"
            fill={stage >= 4 ? '#F472B6' : '#FCA5A5'}
            opacity="0.6"
          />
          <ellipse
            cx={stage === 1 ? '118' : '126'}
            cy={stage === 1 ? '96' : '98'}
            rx="7"
            ry="4.5"
            fill={stage >= 4 ? '#F472B6' : '#FCA5A5'}
            opacity="0.6"
          />

          {/* Eyes (Blinking or Expression) */}
          {isBlinking ? (
            // Closed eyes line
            <g stroke="#3D5A45" strokeWidth="2.5" strokeLinecap="round">
              <path d={stage === 1 ? 'M66 88 Q72 90 78 88' : 'M72 88 Q78 90 84 88'} />
              <path d={stage === 1 ? 'M98 88 Q104 90 110 88' : 'M106 88 Q112 90 118 88'} />
            </g>
          ) : localExpression === 'happy' || localExpression === 'cheer' ? (
            // Smiling eye curves ^_^
            <g stroke="#2F4F36" strokeWidth="2.5" strokeLinecap="round" fill="none">
              <path d={stage === 1 ? 'M67 89 Q73 83 79 89' : 'M73 89 Q79 83 85 89'} />
              <path d={stage === 1 ? 'M97 89 Q103 83 109 89' : 'M105 89 Q111 83 117 89'} />
            </g>
          ) : (
            // Normal warm open eyes with gentle reflection
            <g>
              <circle cx={stage === 1 ? '73' : '79'} cy="88" r="4" fill="#2E4A35" />
              <circle cx={stage === 1 ? '72' : '78'} cy="86.5" r="1.3" fill="#FFFFFF" />
              <circle cx={stage === 1 ? '103' : '111'} cy="88" r="4" fill="#2E4A35" />
              <circle cx={stage === 1 ? '102' : '110'} cy="86.5" r="1.3" fill="#FFFFFF" />
            </g>
          )}

          {/* Gentle Mouth */}
          {localExpression === 'happy' || localExpression === 'cheer' ? (
            <path
              d={stage === 1 ? 'M84 96 Q88 103 92 96' : 'M91 97 Q95 105 99 97'}
              stroke="#2E4A35"
              strokeWidth="2.2"
              strokeLinecap="round"
              fill={localExpression === 'cheer' ? '#FCA5A5' : 'none'}
            />
          ) : (
            <path
              d={stage === 1 ? 'M85 96 Q88 99 91 96' : 'M92 97 Q95 100 98 97'}
              stroke="#2E4A35"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
          )}

          {/* Equipped: Clothes & Hats & Accessories Rendering */}
          {/* 1. Straw Hat */}
          {equippedClothes === 'straw_hat' && (
            <g id="item-straw-hat">
              <ellipse cx="94" cy="46" rx="36" ry="7" fill="#FDE047" stroke="#CA8A04" strokeWidth="1.5" />
              <path
                d="M72 45 C72 30 116 30 116 45 Z"
                fill="#FACC15"
                stroke="#CA8A04"
                strokeWidth="1.5"
              />
              <rect x="76" y="41" width="36" height="4" rx="2" fill="#15803D" />
            </g>
          )}

          {/* 2. Ribbon Pin */}
          {equippedAccessory === 'ribbon_pin' && (
            <g id="item-ribbon-pin" transform="translate(118, 54)">
              <circle cx="8" cy="8" r="4" fill="#EF4444" />
              <polygon points="8,8 0,3 0,13" fill="#F87171" stroke="#DC2626" strokeWidth="1" />
              <polygon points="8,8 16,3 16,13" fill="#F87171" stroke="#DC2626" strokeWidth="1" />
            </g>
          )}

          {/* 3. Smart Glasses */}
          {equippedAccessory === 'smart_glasses' && (
            <g id="item-smart-glasses" stroke="#2563EB" strokeWidth="1.8" fill="none">
              <circle cx={stage === 1 ? '73' : '79'} cy="88" r="8" fill="#DBEAFE" fillOpacity="0.4" />
              <circle cx={stage === 1 ? '103' : '111'} cy="88" r="8" fill="#DBEAFE" fillOpacity="0.4" />
              <line
                x1={stage === 1 ? '81' : '87'}
                y1="88"
                x2={stage === 1 ? '95' : '103'}
                y2="88"
              />
            </g>
          )}

          {/* 4. Cozy Scarf */}
          {equippedClothes === 'cozy_scarf' && (
            <g id="item-cozy-scarf">
              <path
                d="M58 112 C72 122 118 122 132 112 C136 120 128 128 95 128 C62 128 54 120 58 112 Z"
                fill="#F472B6"
                stroke="#DB2777"
                strokeWidth="1.5"
              />
              {/* Hanging tail */}
              <rect x="110" y="118" width="12" height="24" rx="3" fill="#EC4899" stroke="#DB2777" strokeWidth="1" />
              <line x1="112" y1="140" x2="114" y2="144" stroke="#BE185D" strokeWidth="1.5" />
              <line x1="116" y1="140" x2="118" y2="144" stroke="#BE185D" strokeWidth="1.5" />
              <line x1="120" y1="140" x2="122" y2="144" stroke="#BE185D" strokeWidth="1.5" />
            </g>
          )}

          {/* 5. Flower Crown */}
          {equippedClothes === 'flower_crown' && (
            <g id="item-flower-crown" transform="translate(48, 38)">
              <path d="M0 16 Q46 6 92 16" stroke="#4ADE80" strokeWidth="3" fill="none" />
              {/* Flowers */}
              <circle cx="16" cy="13" r="5" fill="#F472B6" />
              <circle cx="16" cy="13" r="2" fill="#FEF08A" />
              <circle cx="46" cy="10" r="6" fill="#FDE047" />
              <circle cx="46" cy="10" r="2.5" fill="#F97316" />
              <circle cx="76" cy="13" r="5" fill="#60A5FA" />
              <circle cx="76" cy="13" r="2" fill="#FEF08A" />
            </g>
          )}

          {/* 6. Star Wand */}
          {equippedAccessory === 'star_wand' && (
            <g id="item-star-wand" transform="translate(138, 70) rotate(20)">
              <rect x="10" y="12" width="4" height="42" rx="2" fill="#FDE047" stroke="#CA8A04" strokeWidth="1" />
              <polygon
                points="12,0 15,9 24,9 17,14 20,23 12,17 4,23 7,14 0,9 9,9"
                fill="#FEF08A"
                stroke="#EAB308"
                strokeWidth="1.2"
              />
            </g>
          )}

          {/* 7. Rainbow Cape */}
          {equippedClothes === 'rainbow_cape' && (
            <g id="item-rainbow-cape" opacity="0.85">
              <path
                d="M32 108 C15 130 35 155 75 145 C60 138 50 120 48 108 Z"
                fill="#C084FC"
                stroke="#9333EA"
                strokeWidth="1.2"
              />
              <path
                d="M158 108 C175 130 155 155 115 145 C130 138 140 120 142 108 Z"
                fill="#60A5FA"
                stroke="#2563EB"
                strokeWidth="1.2"
              />
            </g>
          )}
        </svg>
      </div>

      {/* Stage Badge (optional) */}
      {showStageBadge && (
        <div className="mt-1 text-xs font-medium text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
          {getStageTitle(stage)}
        </div>
      )}
    </div>
  );
};
