import PortfolioShell from "../../components/PortfolioShell";
import { StackContent } from "../../components/PortfolioPages";

export default function Page() {
  return <PortfolioShell hideGlobalTopbar><StackContent /></PortfolioShell>;
}
