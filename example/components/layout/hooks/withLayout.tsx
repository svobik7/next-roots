import LayoutMain from '../layout-main'

/**
 * HOC component options
 */
type withLayoutOptions = {
  forceLayout?: string
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
  options: withLayoutOptions = {}
): React.FC<P & WithLayoutProps> {
  return function WithLayout(props: P & WithLayoutProps) {
    const { layout: componentLayout = 'main', ...componentProps } = props
    const { forceLayout: layout = componentLayout } = options

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
