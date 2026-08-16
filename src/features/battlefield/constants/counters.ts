import {
    Skull, Shield, Swords, Zap, Feather, ShieldCheck, ShieldPlus,
    Heart, Users, Target, Footprints, Eye, Flame, Crown, Ghost,
    Biohazard, ZapOff, BookOpen, BatteryCharging, type LucideIcon,
} from 'lucide-react';
import { KeywordCounterType, PTCounterType } from '@/types';

export interface PTCounterDef {
    id: PTCounterType;
    label: string;
    deltaPower: number;
    deltaToughness: number;
}

export const PT_COUNTER_DEFS: PTCounterDef[] = [
    { id: 'plus1plus1', label: '+1/+1', deltaPower: 1, deltaToughness: 1 },
    { id: 'plus1plus0', label: '+1/+0', deltaPower: 1, deltaToughness: 0 },
    { id: 'plus0plus1', label: '+0/+1', deltaPower: 0, deltaToughness: 1 },
    { id: 'minus1minus1', label: '-1/-1', deltaPower: -1, deltaToughness: -1 },
    { id: 'minus1minus0', label: '-1/-0', deltaPower: -1, deltaToughness: 0 },
    { id: 'minus0minus1', label: '-0/-1', deltaPower: 0, deltaToughness: -1 },
];

export interface KeywordCounterDef {
    id: KeywordCounterType;
    label: string;
    icon: LucideIcon;
}

export const KEYWORD_COUNTER_DEFS: KeywordCounterDef[] = [
    { id: 'deathtouch', label: 'Toque Mortífero (Deathtouch)', icon: Skull },
    { id: 'doubleStrike', label: 'Golpe Duplo (Double Strike)', icon: Swords },
    { id: 'firstStrike', label: 'Iniciativa (First Strike)', icon: Zap },
    { id: 'flying', label: 'Voar (Flying)', icon: Feather },
    { id: 'hexproof', label: 'Resistência à magia (Hexproof)', icon: ShieldCheck },
    { id: 'indestructible', label: 'Indestrutível (Indestructible)', icon: ShieldPlus },
    { id: 'lifelink', label: 'Vínculo com a Vida (Lifelink)', icon: Heart },
    { id: 'menace', label: 'Ameaçar (Menace)', icon: Users },
    { id: 'reach', label: 'Alcance (Reach)', icon: Target },
    { id: 'trample', label: 'Atropelar (Trample)', icon: Footprints },
    { id: 'vigilance', label: 'Vigilância (Vigilance)', icon: Eye },
    { id: "haste", label: "Ímpeto (Haste)", icon: Flame },
    { id: "exalted", label: "Exaltado (Exalted)", icon: Crown },
    { id: "shadow", label: "Sombra (Shadow)", icon: Ghost },
    { id: "decayed", label: "Destruído (Decayed)", icon: Biohazard },
    { id: "shield", label: "Marcador de Escudo (Shield)", icon: Shield },
    { id: "stun", label: "Marcador de Atordoamento (Stun)", icon: ZapOff },
    { id: "lore", label: "Marcador de Saber (Lore)", icon: BookOpen },
    { id: "charge", label: "Marcador de Carga (Charge)", icon: BatteryCharging },
];
