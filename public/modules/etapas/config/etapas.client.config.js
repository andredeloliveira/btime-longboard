'use strict';

// Configuring the Articles module
angular.module('etapas').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Etapas', 'etapas', 'dropdown', '/etapas(/create)?');
		Menus.addSubMenuItem('topbar', 'etapas', 'List Etapas', 'etapas');
		Menus.addSubMenuItem('topbar', 'etapas', 'New Etapa', 'etapas/create');
	}
]);