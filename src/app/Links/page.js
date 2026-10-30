import PortfolioShell from "../../components/PortfolioShell";
import { LinksContent } from "../../components/PortfolioPages";

export default function Page() {
  return <PortfolioShell hideGlobalTopbar><LinksContent /></PortfolioShell>;
}
