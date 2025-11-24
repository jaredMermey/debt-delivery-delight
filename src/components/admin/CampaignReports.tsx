import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { campaignStore } from '@/lib/campaignStore';
import { PaymentMethodType, ConsumerTracking } from '@/types/campaign';
import { AddPayeesDialog } from '@/components/admin/AddPayeesDialog';
import { 
  ArrowLeft, 
  Users, 
  Mail, 
  MousePointer, 
  DollarSign, 
  TrendingUp, 
  CheckCircle,
  Search,
  Filter,
  Clock,
  UserPlus
} from 'lucide-react';

export function CampaignReports() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ConsumerTracking['status'] | 'all'>('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<PaymentMethodType | 'all'>('all');
  const [addPayeesOpen, setAddPayeesOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const campaign = campaignId ? campaignStore.getCampaign(campaignId) : null;
  const stats = campaignId ? campaignStore.getCampaignStats(campaignId) : null;

  const consumers = useMemo(() => {
    if (!campaignId) return [];
    
    const filters: any = {};
    if (statusFilter !== 'all') filters.status = statusFilter;
    if (paymentMethodFilter !== 'all') filters.paymentMethod = paymentMethodFilter;
    
    return campaignStore.searchConsumers(campaignId, searchQuery, filters);
  }, [campaignId, searchQuery, statusFilter, paymentMethodFilter, refreshKey]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDateTime = (date: string | Date | undefined) => {
    if (!date) return '-';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(dateObj);
  };

  const getStatusColor = (status: ConsumerTracking['status']) => {
    switch (status) {
      case 'pending': return 'bg-slate-100 text-slate-800';
      case 'email_sent': return 'bg-blue-100 text-blue-800';
      case 'email_opened': return 'bg-cyan-100 text-cyan-800';
      case 'link_clicked': return 'bg-purple-100 text-purple-800';
      case 'payment_selected': return 'bg-orange-100 text-orange-800';
      case 'funds_originated': return 'bg-yellow-100 text-yellow-800';
      case 'funds_settled': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusLabel = (status: ConsumerTracking['status']) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'email_sent': return 'Email Sent';
      case 'email_opened': return 'Email Opened';
      case 'link_clicked': return 'Link Clicked';
      case 'payment_selected': return 'Payment Selected';
      case 'funds_originated': return 'Funds Originated';
      case 'funds_settled': return 'Funds Settled';
      default: return 'Unknown';
    }
  };

  if (!campaign || !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground">Campaign not found</h3>
          <p className="text-muted-foreground">The requested campaign could not be loaded.</p>
          <Link to="/admin">
            <Button className="mt-4">Return to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{campaign.name}</h1>
            <p className="text-muted-foreground">Campaign Performance Report</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setAddPayeesOpen(true)}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add More Payees
          </Button>
          <Badge variant="outline" className="capitalize">
            {campaign.status}
          </Badge>
          {campaign.sent_at && (
            <span className="text-sm text-muted-foreground">
              Sent {formatDateTime(campaign.sent_at)}
            </span>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.total_consumers}</p>
                <p className="text-sm text-muted-foreground">Total Consumers</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.email_open_rate.toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground">Email Open Rate</p>
                <p className="text-xs text-muted-foreground">{stats.emails_opened}/{stats.emails_sent}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <MousePointer className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.link_click_rate.toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground">Click Rate</p>
                <p className="text-xs text-muted-foreground">{stats.links_clicked}/{stats.emails_opened}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.completion_rate.toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
                <p className="text-xs text-muted-foreground">{stats.funds_settled}/{stats.total_consumers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Total Amount
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">{formatCurrency(stats.total_amount)}</p>
            <p className="text-sm text-muted-foreground">Total disbursement</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Originated
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-emerald-600">{formatCurrency(stats.originated_amount)}</p>
            <p className="text-sm text-muted-foreground">
              {stats.funds_originated} of {stats.total_consumers} consumers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Settled
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-emerald-700">{formatCurrency(stats.settled_amount)}</p>
            <p className="text-sm text-muted-foreground">
              {stats.funds_settled} completed payments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Consumer Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <CardTitle className="text-xl">Consumer Activity</CardTitle>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search consumers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="email_sent">Email Sent</SelectItem>
                  <SelectItem value="email_opened">Email Opened</SelectItem>
                  <SelectItem value="link_clicked">Link Clicked</SelectItem>
                  <SelectItem value="payment_selected">Payment Selected</SelectItem>
                  <SelectItem value="funds_originated">Funds Originated</SelectItem>
                  <SelectItem value="funds_settled">Funds Settled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Consumer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Link Click</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Last Activity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {consumers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No consumers found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  consumers.map((consumer) => (
                    <TableRow key={consumer.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-foreground">{consumer.name}</p>
                          <p className="text-sm text-muted-foreground">{consumer.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(consumer.amount)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(consumer.tracking.status)}>
                          {getStatusLabel(consumer.tracking.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {consumer.tracking.email_opened ? (
                            <span className="text-emerald-600 flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              {formatDateTime(consumer.tracking.email_opened_at)}
                            </span>
                          ) : consumer.tracking.email_sent ? (
                            <span className="text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Sent {formatDateTime(consumer.tracking.email_sent_at)}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {consumer.tracking.link_clicked ? (
                            <span className="text-purple-600 flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              {formatDateTime(consumer.tracking.link_clicked_at)}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {consumer.tracking.payment_method_selected ? (
                          <Badge variant="outline" className="capitalize">
                            {consumer.tracking.payment_method_selected}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDateTime(consumer.tracking.last_activity)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {campaign && (
        <AddPayeesDialog
          campaignId={campaign.id}
          campaignName={campaign.name}
          existingConsumerCount={campaign.consumers.length}
          open={addPayeesOpen}
          onOpenChange={setAddPayeesOpen}
          onSuccess={() => setRefreshKey(prev => prev + 1)}
        />
      )}
    </div>
  );
}
