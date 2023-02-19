// eslint-disable-next-line import/no-unresolved
import { TJSDialog } from '@typhonjs-fvtt/runtime/svelte/application';

import ActionConfigDialogComponent from '../ActionConfigDialog.svelte';

/**
 * Provides a dialog for creating documents that by default is modal and not draggable.
 */
export default class ActionConfigDialog extends TJSDialog {
  constructor(item, actionId, actionName) {
    super({
      title: actionName,
      content: {
        class: ActionConfigDialogComponent,
        props: { actionId, item }
      }
    }, {
      classes: ['a5e-sheet'],
      width: 520,
      height: 592
    });
  }
}
