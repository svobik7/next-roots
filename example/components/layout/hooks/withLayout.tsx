import LayoutMain from '../layout-main'

/**
 * HOC component options
 */
type withLayoutOptions<P> = {
  useLayout?: string | ((props: P, initial: string) => string)
}

/**
 * HOC component props
 */
type WithLayoutProps = {
  layout?: string
}

/**
 * HOC component
 * @param Component
 * @param options
 */
export default function withLayout<P extends object>(
  Component: React.ComponentType<P>,
  options: withLayoutOptions<P> = {}
): React.FC<P & WithLayoutProps> {
  return function WithLayout(props: P & WithLayoutProps) {
    const { layout: componentLayout = 'main', ...componentProps } = props

    // set default value of useLayout to value of Component's props.layout
    const { useLayout = componentLayout } = options

    // detect which layout should be used
    const layout =
      typeof useLayout === 'string'
        ? useLayout
        : useLayout(props, componentLayout)

    if (layout === 'main') {
      return (
        <LayoutMain>
          <Component {...(componentProps as P)} />
        </LayoutMain>
      )
    }

    return <Component {...(componentProps as P)} />
  }
}
