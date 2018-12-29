import Meta from '../meta';
import { IMessageToggle } from '../../../interfaces/communication';

(() => {
  const toggleFunction = function() {
    const message: IMessageToggle = {
      toggle: {
        featureId: Meta.id,
        value: true,
        fromPage: true,
      }
    };
    window.postMessage(message, '*');
  };

  const replyFunction = (window as any).reply;
  (window as any).reply = (id: number) => {
    replyFunction(id);
    toggleFunction();
  };

  const replyThreadFormFunction = (window as any).replyThreadForm;
  (window as any).replyThreadForm = (id: number) => {
    replyThreadFormFunction(id);
    toggleFunction();
  };
})();
