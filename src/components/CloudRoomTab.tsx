/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CloudStage, CloudState, ShopItem } from '../types.ts';
import { CloudCharacter } from './CloudCharacter.tsx';
import { SHOP_ITEMS } from '../data/shopItems.ts';
import { calculateCloudStage } from '../utils/storage.ts';
import { Coins, Check, ShoppingBag, Sparkles, AlertCircle } from 'lucide-react';

interface CloudRoomTabProps {
  cloudState: CloudState;
  onBuyItem: (item: ShopItem) => boolean;
  onToggleEquip: (item: ShopItem) => void;
}

export const CloudRoomTab: React.FC<CloudRoomTabProps> = ({
  cloudState,
  onBuyItem,
  onToggleEquip,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'fashion' | 'decor'>('all');
  const [roomTabMode, setRoomTabMode] = useState<'shop' | 'closet'>('closet');
  const [purchaseAlert, setPurchaseAlert] = useState<string | null>(null);

  const currentStage = calculateCloudStage(cloudState.totalEarnedCoins);

  // Growth thresholds
  const stageInfo: Record<CloudStage, { name: string; minCoins: number; nextStageMin: number }> = {
    1: { name: '아기 구름', minCoins: 0, nextStageMin: 50 },
    2: { name: '작은 구름', minCoins: 50, nextStageMin: 150 },
    3: { name: '큰 구름', minCoins: 150, nextStageMin: 350 },
    4: { name: '무지개 구름', minCoins: 350, nextStageMin: 350 },
  };

  const nextGoal = stageInfo[currentStage].nextStageMin;
  const stageProgress =
    currentStage === 4
      ? 100
      : Math.min(
          100,
          Math.round(
            ((cloudState.totalEarnedCoins - stageInfo[currentStage].minCoins) /
              (nextGoal - stageInfo[currentStage].minCoins)) *
              100
          )
        );

  const handleBuy = (item: ShopItem) => {
    const success = onBuyItem(item);
    if (success) {
      setPurchaseAlert(`'${item.name}' 구매를 완료했어! 바로 착용해 볼까?`);
    } else {
      setPurchaseAlert('코인이 조금 부족해. 루틴을 체크하거나 행복 저금통에 글을 남겨봐!');
    }
    setTimeout(() => setPurchaseAlert(null), 3000);
  };

  const isEquipped = (item: ShopItem) => {
    if (item.category === 'clothes') return cloudState.equippedClothes === item.id;
    if (item.category === 'accessory') return cloudState.equippedAccessory === item.id;
    if (item.category === 'wallpaper') return cloudState.equippedWallpaper === item.id;
    if (item.category === 'floor') return cloudState.equippedFloor === item.id;
    if (item.category === 'furniture') return cloudState.equippedFurniture === item.id;
    if (item.category === 'plant') return cloudState.equippedPlant === item.id;
    if (item.category === 'lighting') return cloudState.equippedLighting === item.id;
    return false;
  };

  const filteredItems = SHOP_ITEMS.filter((item) => {
    if (activeCategory === 'fashion') {
      return item.category === 'clothes' || item.category === 'accessory';
    }
    if (activeCategory === 'decor') {
      return (
        item.category === 'wallpaper' ||
        item.category === 'floor' ||
        item.category === 'furniture' ||
        item.category === 'plant' ||
        item.category === 'lighting'
      );
    }
    return true;
  });

  // Display items for closet (owned) vs shop
  const displayItems =
    roomTabMode === 'closet'
      ? filteredItems.filter((i) => cloudState.unlockedItemIds.includes(i.id))
      : filteredItems;

  // Background style based on equipped wallpaper
  const getWallpaperClasses = () => {
    switch (cloudState.equippedWallpaper) {
      case 'forest_wall':
        return 'bg-gradient-to-b from-[#DCFCE7] to-[#F0FDF4] border-emerald-300';
      case 'sunset_wall':
        return 'bg-gradient-to-b from-[#FFEDD5] via-[#FED7AA] to-[#FFF7ED] border-orange-200';
      case 'starlight_wall':
        return 'bg-gradient-to-b from-[#312E81] via-[#4338CA] to-[#6366F1] border-indigo-500 text-white';
      default:
        return 'bg-gradient-to-b from-[#FFFDF7] to-[#F5FAF6] border-emerald-100';
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Top Growth & Coin Status Card */}
      <div className="p-4 bg-white rounded-3xl border border-emerald-100 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏡</span>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-800">
                몽글이의 방 ({stageInfo[currentStage].name})
              </h2>
              <span className="text-[11px] text-slate-500">
                누적 모은 코인: {cloudState.totalEarnedCoins}개
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-2xl">
            <Coins size={16} className="text-amber-500" />
            <span className="text-xs sm:text-sm font-bold text-amber-900 tabular-nums">
              {cloudState.coins}
            </span>
          </div>
        </div>

        {/* Growth Stage Progress */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-slate-600">
            <span>성장 단계: {stageInfo[currentStage].name}</span>
            <span>
              {currentStage === 4
                ? '최고 단계 달성! 🎉'
                : `다음 단계까지 ${Math.max(0, nextGoal - cloudState.totalEarnedCoins)} 코인`}
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-500"
              style={{ width: `${stageProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Visual Interactive Cloud Room Scene */}
      <div
        className={`relative w-full h-72 rounded-3xl border shadow-sm overflow-hidden flex flex-col justify-between p-4 transition-all duration-300 ${getWallpaperClasses()}`}
      >
        {/* Sky/Wall Elements */}
        {cloudState.equippedWallpaper === 'starlight_wall' && (
          <div className="absolute inset-0 pointer-events-none opacity-40">
            <div className="absolute top-4 left-8 text-yellow-200 text-xs animate-ping">✦</div>
            <div className="absolute top-10 right-12 text-yellow-200 text-xs">✦</div>
            <div className="absolute top-20 left-24 text-yellow-100 text-[10px]">✦</div>
          </div>
        )}

        {/* Top Floating Lighting / Moon Lamp */}
        {cloudState.equippedLighting === 'moon_lamp' && (
          <div className="absolute top-3 right-5 z-20 flex flex-col items-center animate-gentle-pulse-slow">
            <div className="w-0.5 h-6 bg-amber-300" />
            <div className="w-10 h-10 rounded-full bg-amber-200 border-2 border-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.6)] flex items-center justify-center text-xs">
              🌕
            </div>
          </div>
        )}

        {/* Room Plants (Corner) */}
        {cloudState.equippedPlant === 'monstera_plant' && (
          <div className="absolute bottom-14 left-4 z-20 flex flex-col items-center">
            <span className="text-3xl filter drop-shadow">🪴</span>
          </div>
        )}

        {/* Room Furniture (Sofa) */}
        {cloudState.equippedFurniture === 'fluffy_sofa' && (
          <div className="absolute bottom-12 right-6 z-20 flex flex-col items-center">
            <span className="text-4xl filter drop-shadow">🛋️</span>
          </div>
        )}

        {/* Cloud Friend in Center */}
        <div className="relative z-10 my-auto flex justify-center items-center">
          <CloudCharacter
            stage={currentStage}
            equippedClothes={cloudState.equippedClothes}
            equippedAccessory={cloudState.equippedAccessory}
            speechText="내 방에 놀러 와줘서 고마워!"
            size="md"
          />
        </div>

        {/* Floor Layer */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-16 border-t flex items-center justify-center z-0 transition-colors ${
            cloudState.equippedFloor === 'wood_floor'
              ? 'bg-[#E5D3B3] border-[#C8B08A]'
              : cloudState.equippedFloor === 'fluffy_rug'
              ? 'bg-[#D1FAE5] border-[#A7F3D0]'
              : 'bg-[#F2ECE1] border-[#E2D8C7]'
          }`}
        >
          {cloudState.equippedFloor === 'fluffy_rug' && (
            <div className="w-48 h-8 rounded-full bg-emerald-200/80 border border-emerald-300 shadow-inner" />
          )}
          {cloudState.equippedFloor === 'wood_floor' && (
            <div className="w-full flex justify-around opacity-30 text-[9px] font-mono text-amber-950">
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
            </div>
          )}
        </div>
      </div>

      {/* Alert toast */}
      {purchaseAlert && (
        <div className="p-3 bg-emerald-100 text-emerald-950 border border-emerald-200 rounded-2xl text-xs flex items-center gap-2 animate-gentle-float">
          <Sparkles size={15} className="text-emerald-700" />
          <span>{purchaseAlert}</span>
        </div>
      )}

      {/* Mode Tabs: 내 옷장/가구 vs 상점 */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setRoomTabMode('closet')}
          className={`flex-1 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-xs ${
            roomTabMode === 'closet'
              ? 'bg-emerald-700 text-white'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          내 옷장 &amp; 꾸미기 ({cloudState.unlockedItemIds.length})
        </button>
        <button
          onClick={() => setRoomTabMode('shop')}
          className={`flex-1 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 ${
            roomTabMode === 'shop'
              ? 'bg-emerald-700 text-white'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <ShoppingBag size={14} />
          <span>몽글 상점</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 text-xs">
        {[
          { id: 'all', label: '전체' },
          { id: 'fashion', label: '의상 & 액세서리' },
          { id: 'decor', label: '방 꾸미기' },
        ].map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCategory(c.id as 'all' | 'fashion' | 'decor')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
              activeCategory === c.id
                ? 'bg-emerald-100 text-emerald-900 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Item Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {displayItems.length === 0 ? (
          <div className="col-span-2 py-8 text-center text-xs text-slate-400 bg-white rounded-3xl border border-slate-100">
            {roomTabMode === 'closet'
              ? '아직 보유한 아이템이 없어. 상점에서 귀여운 옷과 가구를 구경해봐!'
              : '조건에 맞는 아이템이 없어.'}
          </div>
        ) : (
          displayItems.map((item) => {
            const isUnlocked = cloudState.unlockedItemIds.includes(item.id);
            const equipped = isEquipped(item);
            const canAfford = cloudState.coins >= item.price;
            const meetsStage = currentStage >= item.stageRequired;

            return (
              <div
                key={item.id}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between text-xs ${
                  equipped
                    ? 'bg-emerald-50/90 border-emerald-400 shadow-2xs'
                    : 'bg-white border-slate-200 shadow-2xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-sm shadow-2xs"
                      style={{ backgroundColor: item.previewColor || '#E2E8F0' }}
                    >
                      {item.category === 'clothes' || item.category === 'accessory' ? '👒' : '🪴'}
                    </span>
                    {equipped ? (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-200/70 px-2 py-0.5 rounded-full">
                        착용 중
                      </span>
                    ) : isUnlocked ? (
                      <span className="text-[10px] text-slate-400">보유 중</span>
                    ) : (
                      <span className="text-[11px] font-bold text-amber-800 flex items-center gap-0.5">
                        <Coins size={12} className="text-amber-500" />
                        <span>{item.price}</span>
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-slate-800">{item.name}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2 leading-snug">
                    {item.description}
                  </p>

                  {!meetsStage && !isUnlocked && (
                    <div className="flex items-center gap-1 text-[10px] text-rose-500 mt-1">
                      <AlertCircle size={10} />
                      <span>{item.stageRequired}단계 이상 필요</span>
                    </div>
                  )}
                </div>

                {/* Action button */}
                <div className="mt-3 pt-2 border-t border-slate-100">
                  {isUnlocked ? (
                    <button
                      onClick={() => onToggleEquip(item)}
                      className={`w-full py-1.5 rounded-xl font-semibold transition-all ${
                        equipped
                          ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                          : 'bg-emerald-700 text-white hover:bg-emerald-800'
                      }`}
                    >
                      {equipped ? '벗기 / 해제' : '착용하기 / 배치'}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBuy(item)}
                      disabled={!canAfford || !meetsStage}
                      className="w-full py-1.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white rounded-xl font-semibold transition-all"
                    >
                      구매하기 ({item.price}C)
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
