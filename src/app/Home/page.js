import PortfolioShell from "../../components/PortfolioShell";
import { HomeContent } from "../../components/PortfolioPages";

export default function Page() {
  return (
    <div className="home-page-shell">
      <PortfolioShell hideTopbar animateMainOnMount={false}>
        <HomeContent />
      </PortfolioShell>
    </div>
  );
}
