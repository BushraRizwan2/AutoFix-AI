
import React from 'react';
import { Shop } from '../types';
import { MapPinIcon } from './icons/MapPinIcon';
import { StarIcon } from './icons/StarIcon';

interface MapViewProps {
  shops: Shop[];
  onSelectShop: (shop: Shop) => void;
  hoveredShopId: number | null;
  onHoverShop: (id: number | null) => void;
}

const ShopPin: React.FC<{
    shop: Shop;
    isHovered: boolean;
    onHover: (id: number | null) => void;
    onSelect: (shop: Shop) => void;
}> = ({ shop, isHovered, onHover, onSelect }) => {
    return (
        <div
            className="absolute transition-transform duration-300 cursor-pointer"
            style={{ left: shop.position.x, top: shop.position.y, transform: `translate(-50%, -50%) ${isHovered ? 'scale(1.1)' : 'scale(1)'}` }}
            onMouseEnter={() => onHover(shop.id)}
            onMouseLeave={() => onHover(null)}
            onClick={() => onSelect(shop)}
        >
            <div className="relative">
                <MapPinIcon className={`h-10 w-10 drop-shadow-lg transition-colors duration-300 ${isHovered ? 'text-violet-500' : 'text-slate-600'}`} />
                 <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-violet-400/30 transition-all duration-300 ${isHovered ? 'scale-150 opacity-0' : 'scale-100 opacity-100'}`}></div>
                {isHovered && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 bg-slate-800/80 backdrop-blur-lg rounded-lg shadow-2xl p-4 border border-slate-700 z-10 animate-in fade-in duration-200">
                        <h3 className="font-bold text-slate-100">{shop.name}</h3>
                        <p className="text-sm text-slate-400 mt-1">{shop.address}</p>
                        <div className="flex items-center gap-1 text-sm text-slate-400 mt-1">
                          <StarIcon className="h-4 w-4 text-amber-400" />
                          <span className="font-bold text-slate-300">{shop.rating}</span>
                          <span>({shop.reviewCount} reviews)</span>
                        </div>
                        <button onClick={() => onSelect(shop)} className="w-full mt-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold px-3 py-1.5 rounded-md hover:from-violet-500 hover:to-indigo-500 transition-all">
                            Request Quote
                        </button>
                         <div className="absolute left-1/2 -translate-x-1/2 bottom-[-8px] w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-slate-800/80"></div>
                    </div>
                )}
            </div>
        </div>
    );
};


export const MapView: React.FC<MapViewProps> = ({ shops, onSelectShop, hoveredShopId, onHoverShop }) => {
  return (
    <div className="relative w-full h-96 bg-slate-800/50 rounded-lg overflow-hidden border border-slate-700">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0">
            <defs>
                <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(124, 58, 237, 0.1)" strokeWidth="0.5"/>
                </pattern>
                <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                    <rect width="50" height="50" fill="url(#smallGrid)"/>
                    <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(124, 58, 237, 0.2)" strokeWidth="1"/>
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {shops.map(shop => (
            <ShopPin 
                key={shop.id}
                shop={shop}
                isHovered={hoveredShopId === shop.id}
                onHover={onHoverShop}
                onSelect={onSelectShop}
            />
        ))}
    </div>
  );
};
