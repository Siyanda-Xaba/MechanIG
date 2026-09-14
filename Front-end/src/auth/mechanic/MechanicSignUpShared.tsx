import { Ionicons } from '@expo/vector-icons'
import {
  type ReactNode,
} from 'react'
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  TouchableOpacity,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native'

export const CYAN = '#00E5FF'
export const BORDER = '#2C3B42'
export const MUTED = '#7A8A94'
export const GREEN = '#7CFF4F'

export type MechanicSignUpStep =
  | 1
  | 2
  | 3

export const STEP_LABELS = [
  'Personal & Business Details',
  'Professional Verification',
  'Security',
] as const

type FieldRowProps = {
  icon: ReactNode
  label: string
  placeholder: string
  value: string
  onChangeText: (value: string) => void
  style?: StyleProp<ViewStyle>
  keyboardType?: TextInputProps['keyboardType']
}

export function FieldRow({
  icon,
  label,
  placeholder,
  value,
  onChangeText,
  style,
  keyboardType = 'default',
}: FieldRowProps) {
  return (
    <View
      style={[
        styles.fieldWrapper,
        style,
      ]}
    >
      <View style={styles.fieldIcon}>
        {icon}
      </View>

      <View style={styles.fieldTextArea}>
        <Text style={styles.fieldLabel}>
          {label}
        </Text>

        <TextInput
          style={styles.fieldInput}
          placeholder={placeholder}
          placeholderTextColor={MUTED}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
        />
      </View>
    </View>
  )
}

type DropdownRowProps = {
  icon: ReactNode
  label: string
  placeholder: string
  style?: StyleProp<ViewStyle>
  onPress?: () => void
}

export function DropdownRow({
  icon,
  label,
  placeholder,
  style,
  onPress,
}: DropdownRowProps) {
  return (
    <TouchableOpacity
      style={[
        styles.fieldWrapper,
        style,
      ]}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={styles.fieldIcon}>
        {icon}
      </View>

      <View style={styles.fieldTextArea}>
        <Text style={styles.fieldLabel}>
          {label}
        </Text>

        <Text
          style={styles.fieldPlaceholder}
        >
          {placeholder}
        </Text>
      </View>

      <Ionicons
        name="chevron-down"
        size={18}
        color={MUTED}
      />
    </TouchableOpacity>
  )
}

type UploadRowProps = {
  label: string
  onPress?: () => void
}

export function UploadRow({
  label,
  onPress,
}: UploadRowProps) {
  return (
    <TouchableOpacity
      style={styles.fieldWrapper}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={styles.fieldIcon}>
        <Ionicons
          name="document-text-outline"
          size={20}
          color={CYAN}
        />
      </View>

      <View style={styles.fieldTextArea}>
        <Text style={styles.fieldLabel}>
          {label}
        </Text>

        <Text
          style={styles.fieldPlaceholder}
        >
          Upload document
        </Text>
      </View>

      <Ionicons
        name="cloud-upload-outline"
        size={20}
        color={MUTED}
      />
    </TouchableOpacity>
  )
}

type PasswordRowProps = {
  label: string
  placeholder: string
  value: string
  onChangeText: (value: string) => void
  visible: boolean
  onToggleVisible: () => void
}

export function PasswordRow({
  label,
  placeholder,
  value,
  onChangeText,
  visible,
  onToggleVisible,
}: PasswordRowProps) {
  return (
    <View style={styles.fieldWrapper}>
      <View style={styles.fieldIcon}>
        <Ionicons
          name="lock-closed-outline"
          size={20}
          color={CYAN}
        />
      </View>

      <View style={styles.fieldTextArea}>
        <Text style={styles.fieldLabel}>
          {label}
        </Text>

        <TextInput
          style={styles.fieldInput}
          placeholder={placeholder}
          placeholderTextColor={MUTED}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!visible}
        />
      </View>

      <TouchableOpacity
        onPress={onToggleVisible}
        hitSlop={8}
        activeOpacity={0.7}
      >
        <Ionicons
          name={
            visible
              ? 'eye-outline'
              : 'eye-off-outline'
          }
          size={20}
          color={MUTED}
        />
      </TouchableOpacity>
    </View>
  )
}

type StepIndicatorProps = {
  currentStep: MechanicSignUpStep
}

export function StepIndicator({
  currentStep,
}: StepIndicatorProps) {
  return (
    <View>
      <View style={styles.stepRow}>
        {[1, 2, 3].map(
          (stepNumber, index) => (
            <View
              key={stepNumber}
              style={styles.stepItem}
            >
              <View
                style={[
                  styles.stepCircle,
                  stepNumber ===
                    currentStep &&
                    styles.stepCircleActive,
                  stepNumber <
                    currentStep &&
                    styles.stepCircleDone,
                ]}
              >
                {stepNumber <
                currentStep ? (
                  <Ionicons
                    name="checkmark"
                    size={16}
                    color="#00131A"
                  />
                ) : (
                  <Text
                    style={[
                      styles.stepNumber,
                      stepNumber ===
                        currentStep &&
                        styles.stepNumberActive,
                    ]}
                  >
                    {stepNumber}
                  </Text>
                )}
              </View>

              {index < 2 && (
                <View
                  style={[
                    styles.stepLine,
                    stepNumber <
                      currentStep &&
                      styles.stepLineActive,
                  ]}
                />
              )}
            </View>
          )
        )}
      </View>

      <View style={styles.stepLabelRow}>
        {STEP_LABELS.map(
          (label, index) => (
            <Text
              key={label}
              style={[
                styles.stepLabel,
                index + 1 ===
                  currentStep &&
                  styles.stepLabelActive,
              ]}
              numberOfLines={2}
            >
              {label}
            </Text>
          )
        )}
      </View>
    </View>
  )
}

type SignUpHeaderProps = {
  onBack: () => void
  step: MechanicSignUpStep
}

export function SignUpHeader({
  onBack,
  step,
}: SignUpHeaderProps) {
  return (
    <>
      <TouchableOpacity
        style={styles.backButton}
        onPress={onBack}
        hitSlop={10}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Ionicons
          name="chevron-back"
          size={26}
          color="#FFFFFF"
        />
      </TouchableOpacity>

      <View style={styles.logoRow}>
        <Image
          source={require('../../../assets/images/mechaniq-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.title}>
        Create Mechanic Account
      </Text>

      <Text style={styles.subtitle}>
        Step {step} of 3{' '}
        <Text style={styles.dot}>
          •
        </Text>{' '}
        {STEP_LABELS[step - 1]}
      </Text>

      <StepIndicator
        currentStep={step}
      />
    </>
  )
}

type SignUpFooterProps = {
  onSignIn: () => void
}

export function SignUpFooter({
  onSignIn,
}: SignUpFooterProps) {
  return (
    <View style={styles.footerRow}>
      <Text style={styles.footerText}>
        Already have an account?{' '}
      </Text>

      <TouchableOpacity
        onPress={onSignIn}
        activeOpacity={0.7}
      >
        <Text style={styles.footerLink}>
          Sign In
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#000000',
  },

  container: {
    flex: 1,
    backgroundColor: '#000000',
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
  },

  backButton: {
    marginTop: 8,
    marginBottom: 4,
    width: 32,
    height: 32,
    justifyContent: 'center',
  },

  logoRow: {
    alignItems: 'center',
  },

  logo: {
    width: 210,
    height: 100,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 4,
  },

  subtitle: {
    color: '#9AA7AE',
    fontSize: 13.5,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 18,
  },

  dot: {
    color: CYAN,
  },

  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },

  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  stepCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    borderColor: BORDER,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
  },

  stepCircleActive: {
    backgroundColor: CYAN,
    borderColor: CYAN,
  },

  stepCircleDone: {
    backgroundColor: CYAN,
    borderColor: CYAN,
  },

  stepNumber: {
    color: '#9AA7AE',
    fontSize: 14,
    fontWeight: '600',
  },

  stepNumberActive: {
    color: '#00131A',
  },

  stepLine: {
    width: 56,
    height: 2,
    backgroundColor: BORDER,
    marginHorizontal: 4,
  },

  stepLineActive: {
    backgroundColor: CYAN,
  },

  stepLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 22,
    paddingHorizontal: 2,
  },

  stepLabel: {
    flex: 1,
    color: '#7A8A94',
    fontSize: 11,
    textAlign: 'center',
  },

  stepLabelActive: {
    color: CYAN,
    fontWeight: '600',
  },

  fieldWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 14,
  },

  fieldIcon: {
    width: 26,
    alignItems: 'center',
    marginRight: 8,
  },

  fieldTextArea: {
    flex: 1,
  },

  fieldLabel: {
    color: '#B9C4CA',
    fontSize: 12.5,
    marginBottom: 2,
  },

  fieldInput: {
    color: '#FFFFFF',
    fontSize: 14.5,
    padding: 0,
  },

  fieldPlaceholder: {
    color: MUTED,
    fontSize: 14.5,
  },

  halfRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },

  halfField: {
    flex: 1,
    marginRight: 0,
  },

  requirementsBox: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
  },

  requirementsTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
  },

  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  requirementText: {
    color: '#B9C4CA',
    fontSize: 13,
    marginLeft: 8,
    flexShrink: 1,
  },

  verificationBox: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
  },

  verificationHeaderRow: {
    flexDirection: 'row',
    marginBottom: 14,
  },

  verificationHeaderText: {
    marginLeft: 10,
    flex: 1,
  },

  verificationSubtext: {
    color: MUTED,
    fontSize: 12.5,
    marginTop: 2,
  },

  verificationInputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 10,
  },

  verificationInputArea: {
    flex: 1,
    marginRight: 10,
  },

  sendCodeButton: {
    borderWidth: 1,
    borderColor: CYAN,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },

  sendCodeText: {
    color: CYAN,
    fontSize: 13,
    fontWeight: '600',
  },

  verifyCodeButton: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },

  verifyCodeText: {
    color: '#7A8A94',
    fontSize: 13,
    fontWeight: '600',
  },

  twoFactorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  twoFactorTextArea: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
  },

  agreeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },

  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: CYAN,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  checkboxChecked: {
    backgroundColor: CYAN,
  },

  agreeText: {
    flex: 1,
    color: '#B9C4CA',
    fontSize: 13,
  },

  agreeLink: {
    color: CYAN,
  },

  continueButton: {
    backgroundColor: CYAN,
    borderRadius: 14,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },

  continueText: {
    color: '#00131A',
    fontSize: 16,
    fontWeight: '700',
  },

  backOutlineButton: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },

  backOutlineText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },

  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 4,
    flexWrap: 'wrap',
  },

  footerText: {
    color: '#9AA7AE',
    fontSize: 14,
  },

  footerLink: {
    color: CYAN,
    fontSize: 14,
    fontWeight: '600',
  },

  fieldContainer: {
    marginBottom: 14,
  },

  fieldLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 7,
    gap: 8,
  },

  dropdown: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#000000',
  },

  dropdownSelectedText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    flex: 1,
    marginRight: 10,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor:
      'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 25,
  },

  dropdownModal: {
    width: '100%',
    maxHeight: '80%',
    backgroundColor: '#070D14',
    borderWidth: 1,
    borderColor: CYAN,
    borderRadius: 16,
    padding: 18,
  },

  modalTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },

  modalSubtext: {
    color: MUTED,
    fontSize: 12.5,
    textAlign: 'center',
    marginTop: -8,
    marginBottom: 12,
  },

  dropdownOption: {
    minHeight: 48,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },

  dropdownOptionText: {
    color: '#FFFFFF',
    fontSize: 14.5,
  },

  modalDoneButton: {
    backgroundColor: CYAN,
    borderRadius: 10,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },

  modalDoneText: {
    color: '#00131A',
    fontSize: 15,
    fontWeight: '700',
  },
})