import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
    PlusIcon,
    TrendingUpIcon,
    TrendingDownIcon,
    WalletIcon,
    DownloadIcon,
    CalendarIcon,
    HomeIcon,
    UserIcon,
    FilterIcon,
    SearchIcon,
    XIcon
} from "lucide-react";
import { useSelector } from "react-redux";
import { fetchTransactionsByUserId } from "@/apis/transaction";
import { selectCurrentUser } from "@/store/slice/userSlice";

// Types
interface Transaction {
    id: string;
    type: 'income' | 'expense';
    amount: number;
    description: string;
    category: string;
    room?: string;
    tenant?: string;
    date: string;
}

interface StatCardProps {
    title: string;
    amount: number;
    icon: React.ComponentType<any>;
    type: 'income' | 'expense' | 'balance';
    trend?: {
        value: number;
        isPositive: boolean;
    };
}

interface TransactionCardProps {
    transaction: Transaction;
}

interface FilterBarProps {
    onFilterChange: (filters: any) => void;
    activeFilters: any;
}



// Components
function StatCard({ title, amount, icon: Icon, type, trend }: StatCardProps) {
    const getColorClasses = () => {
        switch (type) {
            case 'income':
                return {
                    iconBg: 'bg-income-light',
                    iconColor: 'text-income',
                    textColor: 'text-income'
                };
            case 'expense':
                return {
                    iconBg: 'bg-expense-light',
                    iconColor: 'text-expense',
                    textColor: 'text-expense'
                };
            default:
                return {
                    iconBg: 'bg-primary/10',
                    iconColor: 'text-primary',
                    textColor: 'text-foreground'
                };
        }
    };

    const colors = getColorClasses();

    return (
        <Card className="p-6 bg-gradient-card border-0 shadow-soft hover:shadow-medium transition-all duration-300 animate-slide-up">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-muted-foreground mb-1">{title}</p>
                    <p className={cn("text-2xl font-bold", colors.textColor)}>
                        {amount.toLocaleString('vi-VN')} VNĐ
                    </p>
                    {trend && (
                        <p className={cn(
                            "text-xs mt-1",
                            trend.isPositive ? "text-success" : "text-destructive"
                        )}>
                            {trend.isPositive ? '+' : ''}{trend.value}% so với tháng trước
                        </p>
                    )}
                </div>
                <div className={cn("p-3 rounded-lg", colors.iconBg)}>
                    <Icon className={cn("h-6 w-6", colors.iconColor)} />
                </div>
            </div>
        </Card>
    );
}

function TransactionCard({ transaction }: TransactionCardProps) {
    const isIncome = transaction.type === 'income';

    return (
        <Card className="p-4 hover:shadow-medium transition-all duration-200 bg-gradient-card border-0 animate-fade-in">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "p-2 rounded-lg transition-colors duration-200",
                        isIncome ? "bg-income-light" : "bg-expense-light"
                    )}>
                        {isIncome ? (
                            <TrendingUpIcon className={cn("h-4 w-4", "text-income")} />
                        ) : (
                            <TrendingDownIcon className={cn("h-4 w-4", "text-expense")} />
                        )}
                    </div>

                    <div className="flex-1">
                        <h3 className="font-medium text-foreground">{transaction.description}</h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <CalendarIcon className="h-3 w-3" />
                                <span>{transaction.date}</span>
                            </div>
                            {transaction.room && (
                                <div className="flex items-center gap-1">
                                    <HomeIcon className="h-3 w-3" />
                                    <span>{transaction.room}</span>
                                </div>
                            )}
                            {transaction.tenant && (
                                <div className="flex items-center gap-1">
                                    <UserIcon className="h-3 w-3" />
                                    <span>{transaction.tenant}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="text-right">
                    <div className={cn(
                        "text-lg font-semibold",
                        isIncome ? "text-income" : "text-expense"
                    )}>
                        {isIncome ? '+' : '-'}{transaction.amount.toLocaleString('vi-VN')} VNĐ
                    </div>
                    <Badge
                        variant="outline"
                        className={cn(
                            "mt-1 text-xs border-0",
                            isIncome ? "bg-income-light text-income" : "bg-expense-light text-expense"
                        )}
                    >
                        {transaction.category}
                    </Badge>
                </div>
            </div>
        </Card>
    );
}

function FilterBar({ onFilterChange, activeFilters }: FilterBarProps) {
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        onFilterChange({
            ...activeFilters,
            search: value
        });
    };

    const handleTypeFilter = (type: string) => {
        onFilterChange({
            ...activeFilters,
            type: type === 'all' ? null : type
        });
    };

    const handleDateFilter = (period: string) => {
        onFilterChange({
            ...activeFilters,
            period
        });
    };

    const clearFilters = () => {
        setSearchQuery("");
        onFilterChange({});
    };

    const hasActiveFilters = Object.keys(activeFilters).some(key =>
        activeFilters[key] !== null && activeFilters[key] !== undefined && activeFilters[key] !== ""
    );

    return (
        <div className="space-y-4 animate-fade-in">
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Tìm kiếm giao dịch..."
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    />
                </div>

                <div className="flex gap-2">
                    <Select onValueChange={handleTypeFilter} value={activeFilters.type || 'all'}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Loại" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả</SelectItem>
                            <SelectItem value="income">Thu nhập</SelectItem>
                            <SelectItem value="expense">Chi phí</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select onValueChange={handleDateFilter} value={activeFilters.period || 'all'}>
                        <SelectTrigger className="w-[140px]">
                            <CalendarIcon className="h-4 w-4" />
                            <SelectValue placeholder="Thời gian" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả</SelectItem>
                            <SelectItem value="today">Hôm nay</SelectItem>
                            <SelectItem value="week">Tuần này</SelectItem>
                            <SelectItem value="month">Tháng này</SelectItem>
                            <SelectItem value="quarter">Quý này</SelectItem>
                            <SelectItem value="year">Năm này</SelectItem>
                        </SelectContent>
                    </Select>

                    {hasActiveFilters && (
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={clearFilters}
                            className="shrink-0 hover:bg-destructive/10 hover:text-destructive transition-colors duration-200"
                        >
                            <XIcon className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>

            {hasActiveFilters && (
                <div className="flex items-center gap-2 flex-wrap animate-fade-in">
                    <span className="text-sm text-muted-foreground">Bộ lọc đang áp dụng:</span>
                    {activeFilters.type && (
                        <Badge variant="secondary" className="gap-1">
                            <FilterIcon className="h-3 w-3" />
                            {activeFilters.type === 'income' ? 'Thu nhập' : 'Chi phí'}
                        </Badge>
                    )}
                    {activeFilters.period && activeFilters.period !== 'all' && (
                        <Badge variant="secondary" className="gap-1">
                            <CalendarIcon className="h-3 w-3" />
                            {activeFilters.period === 'today' && 'Hôm nay'}
                            {activeFilters.period === 'week' && 'Tuần này'}
                            {activeFilters.period === 'month' && 'Tháng này'}
                            {activeFilters.period === 'quarter' && 'Quý này'}
                            {activeFilters.period === 'year' && 'Năm này'}
                        </Badge>
                    )}
                    {activeFilters.search && (
                        <Badge variant="secondary" className="gap-1">
                            <SearchIcon className="h-3 w-3" />
                            "{activeFilters.search}"
                        </Badge>
                    )}
                </div>
            )}
        </div>
    );
}

// Main Component
export default function Index() {
    const [filters, setFilters] = useState<any>({});
    const [transactions, setTransactions] = useState<any[]>([]);
    const currentUser = useSelector(selectCurrentUser);

    useEffect(() => {
        const fetchData = async () => {
            if (!currentUser?._id) return;
            try {
                const res = await fetchTransactionsByUserId(currentUser._id);
                // Map dữ liệu backend về đúng định dạng Transaction nếu cần
                const data = (res.data || []).map((item: any) => {
                    let type: 'income' | 'expense' = 'income';
                    if (item.senderId?.toString() === currentUser._id?.toString()) {
                        type = 'expense';
                    } else if (item.receiverId?.toString() === currentUser._id?.toString()) {
                        type = 'income';
                    }
                    return {
                        id: item._id,
                        type,
                        amount: Math.abs(item.amount),
                        description: item.description || '',
                        category: item.cardType || '',
                        room: item.orderInfo?.roomId?.name || '',
                        tenant: item.receiverId?.fullName || '',
                        date: item.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN') : '',
                    };
                });
                setTransactions(data);
            } catch (e) {
                setTransactions([]);
            }
        };
        fetchData();
    }, [currentUser]);

    // Calculate statistics
    const stats = useMemo(() => {
        const totalIncome = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const totalExpense = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const balance = totalIncome - totalExpense;

        return {
            totalIncome,
            totalExpense,
            balance
        };
    }, [transactions]);

    // Filter transactions
    const filteredTransactions = useMemo(() => {
        return transactions.filter(transaction => {
            if (filters.type && transaction.type !== filters.type) {
                return false;
            }

            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                return (
                    transaction.description.toLowerCase().includes(searchLower) ||
                    transaction.category.toLowerCase().includes(searchLower) ||
                    transaction.room?.toLowerCase().includes(searchLower) ||
                    transaction.tenant?.toLowerCase().includes(searchLower)
                );
            }

            return true;
        });
    }, [filters, transactions]);

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 animate-fade-in">
                    <div>
                        <h1 className="text-3xl font-bold text-blue-400">
                            Lịch Sử Giao Dịch
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Quản lý và theo dõi các giao dịch thu chi của nhà trọ
                        </p>
                    </div>

                    {/* <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="hover:bg-primary/10 transition-colors duration-200">
                            <DownloadIcon className="h-4 w-4 mr-2" />
                            Xuất Excel
                        </Button>
                        <Button size="sm" className="bg-blue-400 hover:bg-blue-500 transition-all duration-200 hover:scale-105">
                            <PlusIcon className="h-4 w-4 mr-2" />
                            Thêm Giao Dịch
                        </Button>
                    </div> */}
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatCard
                        title="Tổng Thu Nhập"
                        amount={stats.totalIncome}
                        icon={TrendingUpIcon}
                        type="income"
                        trend={{ value: 12.5, isPositive: true }}
                    />
                    <StatCard
                        title="Tổng Chi Phí"
                        amount={stats.totalExpense}
                        icon={TrendingDownIcon}
                        type="expense"
                        trend={{ value: -8.2, isPositive: false }}
                    />
                    <StatCard
                        title="Số Dư"
                        amount={stats.balance}
                        icon={WalletIcon}
                        type="balance"
                        trend={{ value: 15.7, isPositive: true }}
                    />
                </div>

                {/* Filters */}
                <Card className="p-6 mb-6 bg-gradient-card border-0 shadow-soft animate-scale-in">
                    <FilterBar
                        onFilterChange={setFilters}
                        activeFilters={filters}
                    />
                </Card>

                {/* Transaction List */}
                <Card className="p-6 bg-gradient-card border-0 shadow-soft animate-slide-up">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-foreground">
                            Giao Dịch Gần Đây
                        </h2>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CalendarIcon className="h-4 w-4" />
                            <span>{filteredTransactions.length} giao dịch</span>
                        </div>
                    </div>

                    <Separator className="mb-6" />

                    <div className="space-y-4">
                        {filteredTransactions.length > 0 ? (
                            filteredTransactions.map((transaction, index) => (
                                <div
                                    key={transaction.id}
                                    className="animate-fade-in"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <TransactionCard transaction={transaction} />
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 animate-fade-in">
                                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                    <WalletIcon className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-medium text-foreground mb-2">
                                    Không tìm thấy giao dịch
                                </h3>
                                <p className="text-muted-foreground">
                                    Thử thay đổi bộ lọc để xem thêm giao dịch
                                </p>
                            </div>
                        )}
                    </div>

                    {filteredTransactions.length > 0 && (
                        <div className="mt-6 pt-6 border-t border-border animate-fade-in">
                            <div className="flex justify-center">
                                <Button variant="outline" className="hover:bg-primary/10 transition-colors duration-200">
                                    Xem Thêm Giao Dịch
                                </Button>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}