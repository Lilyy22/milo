export const StagesProperties = () => {
  const statusColor = (status: string): string => {
    switch (status) {
      case "Active":
        return "text-emerald-600 dark:text-emerald-400";
      case "No Active":
        return "text-rose-500 dark:text-rose-400";
      default:
        return "text-slate-500 dark:text-slate-400";
    }
  };

  const amountColor = (amount: string): string => {
    switch (amount.charAt(0)) {
      case "+":
        return "text-emerald-500";
      default:
        return "text-slate-800 dark:text-slate-300";
    }
  };

  return {
    statusColor,
    amountColor,
  };
};
