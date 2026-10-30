import PortfolioShell from "../../components/PortfolioShell";
import { RecommendationContent } from "../../components/PortfolioPages";

export default function Page() {
  return <PortfolioShell hideGlobalTopbar><RecommendationContent /></PortfolioShell>;
}
