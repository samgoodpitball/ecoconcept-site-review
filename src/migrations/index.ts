import * as migration_20260730_194156_initial from './20260730_194156_initial';
import * as migration_20260801_210639_add_lead_fields from './20260801_210639_add_lead_fields';
import * as migration_20260801_221313_add_catalog_content from './20260801_221313_add_catalog_content';
import * as migration_20260807_120000_remove_ykr_and_placeholder_projects from './20260807_120000_remove_ykr_and_placeholder_projects';
import * as migration_20260810_120000_restructure_catalog_menu from './20260810_120000_restructure_catalog_menu';

export const migrations = [
  {
    up: migration_20260730_194156_initial.up,
    down: migration_20260730_194156_initial.down,
    name: '20260730_194156_initial',
  },
  {
    up: migration_20260801_210639_add_lead_fields.up,
    down: migration_20260801_210639_add_lead_fields.down,
    name: '20260801_210639_add_lead_fields',
  },
  {
    up: migration_20260801_221313_add_catalog_content.up,
    down: migration_20260801_221313_add_catalog_content.down,
    name: '20260801_221313_add_catalog_content'
  },
  {
    up: migration_20260807_120000_remove_ykr_and_placeholder_projects.up,
    down: migration_20260807_120000_remove_ykr_and_placeholder_projects.down,
    name: '20260807_120000_remove_ykr_and_placeholder_projects',
  },
  {
    up: migration_20260810_120000_restructure_catalog_menu.up,
    down: migration_20260810_120000_restructure_catalog_menu.down,
    name: '20260810_120000_restructure_catalog_menu',
  },
];
