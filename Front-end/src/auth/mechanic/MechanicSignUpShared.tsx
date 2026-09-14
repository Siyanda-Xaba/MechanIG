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
export const BORDER = '#333333'
export const MUTED = '#888888'
export const GREEN = '#7CFF4F'

export type MechanicSignUpStep =
  | 1
  | 2
  | 3

export const STEP_LABELS = [
  'Personal Details',
  'Professional Details',
  'Security',
] as const

const STEP_SUBTITLES: Record<
  MechanicSignUpStep,
  string
> = {
  1: "Let's get to know you and your business.",
  2: 'Tell us about your professional experience.',
  3: 'Secure your account.',
}

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
          placeholderTextColor="#666666"
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
  value?: string
  style?: StyleProp<ViewStyle>
  onPress?: () => void
}

export function DropdownRow({
  icon,
  label,
  placeholder,
  value = '',
  style,
  onPress,
}: DropdownRowProps) {
  return (
    <TouchableOpacity
      style={[
        styles.fieldWrapper,
        style,
      ]}
      activeOpacity={0.8}
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
          style={
            value
              ? styles.fieldInput
              : styles.fieldPlaceholder
          }
          numberOfLines={1}
        >
          {value || placeholder}
        </Text>
      </View>

      <Ionicons
        name="chevron-down"
        size={18}
        color="#888888"
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
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View style={styles.fieldIcon}>
        <Ionicons
          name="document-text-outline"
          size={18}
          color="#888888"
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
        size={18}
        color="#888888"
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
          size={18}
          color="#888888"
        />
      </View>

      <View style={styles.fieldTextArea}>
        <Text style={styles.fieldLabel}>
          {label}
        </Text>

        <TextInput
          style={styles.fieldInput}
          placeholder={placeholder}
          placeholderTextColor="#666666"
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
              ? 'eye-off-outline'
              : 'eye-outline'
          }
          size={20}
          color="#888888"
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
    <View
      style={styles.stepIndicatorRow}
    >
      {STEP_LABELS.map(
        (label, index) => {
          const stepNumber =
            (index +
              1) as MechanicSignUpStep

          return (
            <View
              key={stepNumber}
              style={styles.stepItem}
            >
              {index <
                STEP_LABELS.length -
                  1 && (
                <View
                  style={[
                    styles.stepConnector,
                    currentStep >
                      stepNumber &&
                      styles.stepConnectorActive,
                  ]}
                />
              )}

              <View
                style={[
                  styles.stepCircle,
                  currentStep >=
                    stepNumber &&
                    styles.stepCircleActive,
                ]}
              >
                <Text
                  style={[
                    styles.stepNumber,
                    currentStep >=
                      stepNumber &&
                      styles.stepNumberActive,
                  ]}
                >
                  {stepNumber}
                </Text>
              </View>

              <Text
                style={[
                  styles.stepLabel,
                  currentStep ===
                    stepNumber &&
                    styles.stepLabelActive,
                ]}
                numberOfLines={2}
              >
                {label}
              </Text>
            </View>
          )
        }
      )}
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
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Ionicons
          name="arrow-back"
          size={24}
          color="#FFFFFF"
        />
      </TouchableOpacity>

      <View
        style={styles.logoContainer}
      >
        <Image
          source={require('../../../assets/images/mechaniq-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.title}>
        Create Your Account
      </Text>

      <Text style={styles.subtitle}>
        {STEP_SUBTITLES[step]}
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
          Log in
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },

  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    marginBottom: 10,
  },

  logoContainer: {
    alignItems: 'center',
    marginBottom: 6,
  },

  logo: {
    width: 150,
    height: 80,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 6,
  },

  subtitle: {
    color: '#AAAAAA',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 20,
  },

  stepIndicatorRow: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 24,
  },

  stepItem: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },

  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: '#555555',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0D0D0D',
    zIndex: 2,
  },

  stepCircleActive: {
    backgroundColor: CYAN,
    borderColor: CYAN,
  },

  stepNumber: {
    color: '#888888',
    fontWeight: 'bold',
    fontSize: 13,
  },

  stepNumberActive: {
    color: '#000000',
  },

  stepLabel: {
    color: '#777777',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 6,
    width: '100%',
  },

  stepLabelActive: {
    color: CYAN,
    fontWeight: 'bold',
  },

  stepConnector: {
    position: 'absolute',
    top: 14,
    left: '50%',
    right: '-50%',
    height: 2,
    backgroundColor: '#444444',
    zIndex: 1,
  },

  stepConnectorActive: {
    backgroundColor: CYAN,
  },

  section: {
    marginBottom: 10,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 4,
  },

  sectionTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
    marginLeft: 8,
  },

  sectionSubtitle: {
    color: '#888888',
    fontSize: 12,
    marginBottom: 16,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  halfWidth: {
    width: '48%',
  },

  fieldWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 14,
  },

  fieldIcon: {
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  fieldTextArea: {
    flex: 1,
  },

  fieldLabel: {
    color: '#999999',
    fontSize: 11,
  },

  fieldInput: {
    color: '#FFFFFF',
    fontSize: 13,
    paddingVertical: 2,
  },

  fieldPlaceholder: {
    color: '#666666',
    fontSize: 13,
    paddingVertical: 2,
  },

  halfRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  halfField: {
    width: '48%',
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
    borderColor: '#333333',
    borderRadius: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0D0D0D',
  },

  dropdownSelectedText: {
    color: '#FFFFFF',
    fontSize: 13,
    flex: 1,
    marginRight: 10,
  },

  requirementsBox: {
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },

  requirementsTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },

  requirementText: {
    color: '#AAAAAA',
    fontSize: 11,
    marginLeft: 8,
    flex: 1,
  },

  verificationBox: {
    marginBottom: 14,
  },

  verificationHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 10,
    marginBottom: 10,
  },

  verificationHeaderText: {
    marginLeft: 10,
    flex: 1,
  },

  verificationSubtext: {
    color: '#888888',
    fontSize: 11,
    marginTop: 2,
  },

  verificationInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 14,
  },

  verificationInputArea: {
    flex: 1,
    marginRight: 10,
  },

  sendCodeButton: {
    borderWidth: 1,
    borderColor: CYAN,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  sendCodeText: {
    color: CYAN,
    fontSize: 11,
    fontWeight: 'bold',
  },

  verifyCodeButton: {
    borderWidth: 1,
    borderColor: '#444444',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  verifyCodeText: {
    color: '#666666',
    fontSize: 11,
    fontWeight: 'bold',
  },

  twoFactorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },

  twoFactorTextArea: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
  },

  agreeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  checkbox: {
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  checkboxChecked: {
    backgroundColor: 'transparent',
  },

  agreeText: {
    flex: 1,
    color: '#AAAAAA',
    fontSize: 11,
  },

  agreeLink: {
    color: CYAN,
  },

  buttonRow: {
    flexDirection: 'row',
    marginTop: 4,
  },

  continueButton: {
    flex: 1,
    backgroundColor: CYAN,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },

  continueText: {
    color: '#000000',
    fontSize: 13,
    fontWeight: 'bold',
  },

  backOutlineButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: CYAN,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },

  backOutlineText: {
    color: CYAN,
    fontSize: 13,
    fontWeight: 'bold',
  },

  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
    flexWrap: 'wrap',
  },

  footerText: {
    color: '#AAAAAA',
    fontSize: 12,
  },

  footerLink: {
    color: CYAN,
    fontSize: 12,
    fontWeight: 'bold',
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
    backgroundColor: '#0D0D0D',
    borderWidth: 1,
    borderColor: CYAN,
    borderRadius: 12,
    padding: 18,
  },

  modalTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },

  modalSubtext: {
    color: '#888888',
    fontSize: 11,
    textAlign: 'center',
    marginTop: -8,
    marginBottom: 12,
  },

  dropdownOption: {
    minHeight: 46,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },

  dropdownOptionText: {
    color: '#FFFFFF',
    fontSize: 13,
  },

  modalDoneButton: {
    backgroundColor: CYAN,
    borderRadius: 8,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },

  modalDoneText: {
    color: '#000000',
    fontSize: 13,
    fontWeight: 'bold',
  },
})