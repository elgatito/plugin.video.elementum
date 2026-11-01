#!/usr/bin/env python3
"""Check relative conditions (eq(-N,value)) in resources/settings.xml.

Kodi counts every <setting> element of a category, separators included, and ignores conditions
pointing at separators or outside the category. Reordering settings shifts these offsets silently,
so this checks each condition targets a real setting whose type fits the compared value.
"""
import re
import sys
import xml.etree.ElementTree as ET

path = sys.argv[1] if len(sys.argv) > 1 else 'resources/settings.xml'
errors = 0
for category in ET.parse(path).getroot().findall('category'):
    items = category.findall('setting')
    for index, setting in enumerate(items):
        for attr in ('enable', 'visible'):
            for offset, value in re.findall(r'(?:gt|lt|eq)\((-?\d+),([^)]*)\)', setting.get(attr) or ''):
                target_index = index + int(offset)
                name = '%s %s="%s"' % (setting.get('id') or setting.get('label'), attr, setting.get(attr))
                if not 0 <= target_index < len(items):
                    print('%s: points outside category %s' % (name, category.get('label')))
                    errors += 1
                    continue
                target = items[target_index]
                kind = target.get('type')
                if kind in ('lsep', 'sep'):
                    ok = False
                elif value in ('true', 'false'):
                    ok = kind == 'bool'
                elif value.isdigit():
                    ok = kind in ('enum', 'labelenum', 'number', 'slider', 'select')
                else:
                    ok = True
                if not ok:
                    print('%s: points at %s (%s)' % (name, target.get('id') or target.get('label'), kind))
                    errors += 1

print('%s: %d bad condition(s)' % (path, errors))
sys.exit(1 if errors else 0)
