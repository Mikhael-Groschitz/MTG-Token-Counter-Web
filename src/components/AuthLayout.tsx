import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';

type AuthLayoutProps = {
    eyebrow: string;
    title: string;
    subtitle?: string;
    children: ReactNode;
    footer?: ReactNode;
    backTo?: { to: string; label: string };
};

export const AuthLayout = ({ eyebrow, title, subtitle, children, footer, backTo }: AuthLayoutProps) => {
    return (
        <div className="min-h-[90vh] flex items-center justify-center px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="w-full max-w-md"
            >
                <div className="border-l-2 border-purple-500 pl-5 mb-8">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-purple-400">
                        {eyebrow}
                    </span>
                    <h1 className="text-3xl font-bold text-white tracking-tight mt-2">{title}</h1>
                    {subtitle && <p className="text-gray-400 text-sm mt-2 leading-relaxed">{subtitle}</p>}
                </div>

                <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6 sm:p-8">
                    {children}
                </div>

                {footer && <div className="mt-6 text-sm text-gray-500">{footer}</div>}

                {backTo && (
                    <Link
                        to={backTo.to}
                        className="inline-flex items-center gap-2 mt-6 text-sm text-gray-500 hover:text-purple-400 transition-colors"
                    >
                        <ArrowLeft size={15} />
                        {backTo.label}
                    </Link>
                )}
            </motion.div>
        </div>
    );
};

export const Field = ({
    id,
    label,
    icon,
    action,
    children,
}: {
    id: string;
    label: string;
    icon?: ReactNode;
    action?: ReactNode;
    children: ReactNode;
}) => (
    <div className="space-y-1.5">
        <div className="flex items-baseline justify-between">
            <label htmlFor={id} className="text-xs font-medium text-gray-400 flex items-center gap-1.5">
                {icon}
                {label}
            </label>
            {action}
        </div>
        {children}
    </div>
);

export const inputClass =
    'w-full bg-gray-950/60 border border-gray-800 text-gray-100 rounded-lg py-2.5 px-3.5 text-sm focus:outline-none focus:border-purple-500 transition-colors placeholder:text-gray-700';

export const primaryButtonClass =
    'w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed';
