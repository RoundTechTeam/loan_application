import { copyToClipboard } from 'quasar';
import { notify } from 'src/plugins';

export function useBrowser() {
  function selectElement(el: Element) {
    window.getSelection()?.selectAllChildren(el);
  }

  function clipboardCopy(
    content: string,
    opt?: { successMessage?: string; element?: Element }
  ) {
    if (opt?.element) selectElement(opt.element);
    copyToClipboard(content).then(() => {
      notify.success(opt?.successMessage || 'Copied to clipboard', {
        duration: 2000,
      });
    });
  }

  return {
    select: selectElement,
    copy: clipboardCopy,
  };
}
