export function formatBrewCount(value: number, locales?: Intl.LocalesArgument): string {
  return `${new Intl.NumberFormat(locales).format(value)} brews`;
}
