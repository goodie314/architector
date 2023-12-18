import BlueprintBuilder from '../../../../src/structure/blueprint-builder';
import PlainComponent from '../component/plain-component';

new BlueprintBuilder(new PlainComponent().compose()).render();
