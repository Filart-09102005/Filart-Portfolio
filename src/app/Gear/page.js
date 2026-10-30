import PortfolioShell from "../../components/PortfolioShell";
import { GearContent } from "../../components/PortfolioPages";

export default function Page() {
  return <PortfolioShell hideGlobalTopbar><GearContent /></PortfolioShell>;
}
