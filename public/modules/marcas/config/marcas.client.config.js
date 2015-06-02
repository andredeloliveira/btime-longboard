'use strict';

// Configuring the Articles module
angular.module('marcas').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Marcas', 'marcas', 'dropdown', '/marcas(/create)?');
		Menus.addSubMenuItem('topbar', 'marcas', 'List Marcas', 'marcas');
		Menus.addSubMenuItem('topbar', 'marcas', 'New Marca', 'marcas/create');
	}
]);