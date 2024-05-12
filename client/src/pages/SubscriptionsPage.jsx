import Header from '../components/header/header';
import More from '../components/more/more';
import SubscriptionCard from '../components/subscription-card/subscription-card';
import Subscriptions from '../components/subscriptions/subscriptions';

function SubscriptionsPage() {
  return (
    <div>
      <Header />
      <Subscriptions />
      <SubscriptionCard />

    </div>
  );
}

export default SubscriptionsPage;
