'use strict';

// Configuring the Articles module
angular.module('equipamentos').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Equipamentos', 'equipamentos', 'dropdown', '/equipamentos(/create)?');
		Menus.addSubMenuItem('topbar', 'equipamentos', 'List Equipamentos', 'equipamentos');
		Menus.addSubMenuItem('topbar', 'equipamentos', 'New Equipamento', 'equipamentos/create');
	}
]);