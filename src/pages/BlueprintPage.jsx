import Slide01 from '../components/slides/Slide01';
import Slide02 from '../components/slides/Slide02';
import Slide03 from '../components/slides/Slide03';
import Slide04 from '../components/slides/Slide04';
import Slide05 from '../components/slides/Slide05';
import Slide06 from '../components/slides/Slide06';
import Slide07 from '../components/slides/Slide07';
import Slide08 from '../components/slides/Slide08';
import Slide09 from '../components/slides/Slide09';

export default function BlueprintPage() {
  return (
    <div className="slides-container" style={{padding: '24px 0', width: '100%'}}>
      <Slide01 />
      <Slide02 />
      <Slide03 />
      <Slide04 />
      <Slide05 />
      <Slide06 />
      <Slide07 />
      <Slide08 />
      <Slide09 />
    </div>
  );
}
