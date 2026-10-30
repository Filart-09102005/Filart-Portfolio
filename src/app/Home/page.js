import Entrance from "../entrance";
import PortfolioShell from "../../components/PortfolioShell";
import { HeroCopy, HomeContent } from "../../components/PortfolioPages";

export default function Page() {
  return (
    <Entrance introContent={<HeroCopy intro />}>
      <PortfolioShell hideTopbar animateMainOnMount={false}>
        <HomeContent />
      </PortfolioShell>
    </Entrance>
  );
}
