import {
  forwardRef,
} from 'react'
import {
  ScrollView,
  ScrollViewProps,
} from 'react-native'

const StableScrollView =
  forwardRef<
    ScrollView,
    ScrollViewProps
  >(function StableScrollView(
    {
      children,
      ...props
    },
    ref
  ) {
    return (
      <ScrollView
        ref={ref}
        bounces={false}
        alwaysBounceVertical={false}
        overScrollMode="never"
        {...props}
      >
        {children}
      </ScrollView>
    )
  })

export default StableScrollView