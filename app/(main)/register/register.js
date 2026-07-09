import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { styles } from "./registerstyles";
import { API_BASE_URL } from "../../../src/config/ApiConfig.js";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ROLES = {
  PATIENT: "PATIENT",
  FAMILY_MEMBER: "FAMILY_MEMBER",
  FRIEND: "FRIEND",
};

const RolePickerModal = ({ isVisible, onSelect, onClose, selectedRole }) => {
  const formatRoleName = (key) => key.split("_").join(" ");

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
      animationType="fade"
    >
      <TouchableOpacity
        style={styles.modalBackground}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerTitle}>Select Your Role</Text>
          {Object.entries(ROLES).map(([key, value]) => (
            <TouchableOpacity
              key={key}
              style={styles.pickerItem}
              onPress={() => {
                onSelect(value);
                onClose();
              }}
            >
              <Text style={styles.pickerItemText}>{formatRoleName(key)}</Text>
              {selectedRole === value && (
                <Ionicons name="checkmark-circle" size={24} color="#606C38" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default function Register() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedRole, setSelectedRole] = useState(null);

  const [patientEmail, setPatientEmail] = useState("");
  const [patientPassword, setPatientPassword] = useState("");

  const [isRolePickerVisible, setIsRolePickerVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [generalError, setGeneralError] = useState("");
  const [submitErrors, setSubmitErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    role: "",
    patientEmail: "",
    patientPassword: "",
  });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;
  const phoneRegex = /^\d{8,50}$/;
  const fullNameRegex = /^[\u0621-\u064A\w\s]{3,100}$/;

  const validateForm = () => {
    const errors = {};

    if (!fullName.trim()) errors.fullName = "Full Name is required";
    else if (!fullNameRegex.test(fullName))
      errors.fullName = "3–100 letters (Arabic/English), numbers, spaces";

    if (!email.trim()) errors.email = "Email is required";
    else if (!emailRegex.test(email)) errors.email = "Invalid email format";

    if (!password) errors.password = "Password is required";
    else if (!passwordRegex.test(password))
      errors.password = "Min 8 chars: uppercase, lowercase, number";

    if (confirmPassword !== password)
      errors.confirmPassword = "Passwords do not match";

    if (!phoneNumber.trim()) errors.phoneNumber = "Phone number is required";
    else if (!phoneRegex.test(phoneNumber))
      errors.phoneNumber = "Invalid phone number";

    if (!selectedRole) errors.role = "Please select a role";

    const needsPatientEmail =
      selectedRole === ROLES.FAMILY_MEMBER || selectedRole === ROLES.FRIEND;
    const needsPatientPassword = selectedRole === ROLES.FAMILY_MEMBER;

    if (needsPatientEmail && !patientEmail.trim()) {
      errors.patientEmail = "Patient's email is required";
    } else if (needsPatientEmail && !emailRegex.test(patientEmail)) {
      errors.patientEmail = "Invalid patient email";
    }

    if (needsPatientPassword && !patientPassword) {
      errors.patientPassword =
        "Patient's password is required for Family Members";
    }

    setSubmitErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async () => {
    setGeneralError("");
    setSubmitErrors({});

    if (!validateForm()) {
      setGeneralError("Please fix the errors above");
      return;
    }

    setIsLoading(true);

    const payload = {
      full_name: fullName.trim(),
      email: email.trim().toLowerCase(),
      password: password,
      phone_number: phoneNumber.trim(),
      role: selectedRole,
    };

    if (selectedRole === ROLES.FAMILY_MEMBER || selectedRole === ROLES.FRIEND) {
      payload.patient_email = patientEmail.trim().toLowerCase();
    }
    if (selectedRole === ROLES.FAMILY_MEMBER) {
      payload.patient_password = patientPassword;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.detail || "Registration failed");

      
      await AsyncStorage.setItem("access_token", data.access_token);
      await AsyncStorage.setItem("user_role", selectedRole);

      const homeRoute =
        {
          [ROLES.PATIENT]: "role/patient/patientHomePage",
          [ROLES.FAMILY_MEMBER]: "role/family/familyHomePage",
          [ROLES.FRIEND]: "role/friend/friendHomePage",
        }[selectedRole] || "role/patient/patientHomePage";

      router.replace(homeRoute);
    } catch (err) {
      console.error("Registration error:", err);

      let errorMsg = err.message || "Network error. Please try again.";
      const lowerMsg = errorMsg.toLowerCase();

      if (lowerMsg.includes("email") && lowerMsg.includes("already exists")) {
        setSubmitErrors((prev) => ({
          ...prev,
          email: "This email is already registered",
        }));
      } else if (lowerMsg.includes("patient email not found")) {
        setSubmitErrors((prev) => ({
          ...prev,
          patientEmail: "Patient email not found",
        }));
      } else if (
        lowerMsg.includes("invalid credentials") ||
        lowerMsg.includes("verification failed")
      ) {
        setSubmitErrors((prev) => ({
          ...prev,
          patientPassword: "Incorrect patient password",
        }));
      }

      setGeneralError(errorMsg.includes("already exists") ? "" : errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const isPatientLinkingRequired =
    selectedRole === ROLES.FAMILY_MEMBER || selectedRole === ROLES.FRIEND;
  const isPatientPasswordRequired = selectedRole === ROLES.FAMILY_MEMBER;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.title}>Silah</Text>
          <Text style={styles.subtitle}>
            Connecting Lives Preserving Moments.
          </Text>
          <Image
            source={require("../../../assets/lg2.png")}
            style={styles.image}
          />

          
          <View style={styles.inputWrapper}>
            <TextInput
              style={[styles.input, submitErrors.fullName && styles.inputError]}
              placeholder="Full Name"
              placeholderTextColor="#9aa089"
              value={fullName}
              onChangeText={(t) => {
                setFullName(t);
                setSubmitErrors((prev) => ({ ...prev, fullName: "" }));
              }}
              autoCapitalize="words"
            />
            {submitErrors.fullName && (
              <Text style={styles.errorText}>{submitErrors.fullName}</Text>
            )}
          </View>

         
          <View style={styles.inputWrapper}>
            <TextInput
              style={[styles.input, submitErrors.email && styles.inputError]}
              placeholder="Email"
              placeholderTextColor="#9aa089"
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                setSubmitErrors((prev) => ({ ...prev, email: "" }));
              }}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {submitErrors.email && (
              <Text style={styles.errorText}>{submitErrors.email}</Text>
            )}
          </View>

          
          <View style={styles.inputWrapper}>
            <TextInput
              style={[
                styles.input,
                submitErrors.phoneNumber && styles.inputError,
              ]}
              placeholder="Phone Number"
              placeholderTextColor="#9aa089"
              value={phoneNumber}
              onChangeText={(t) => {
                setPhoneNumber(t);
                setSubmitErrors((prev) => ({ ...prev, phoneNumber: "" }));
              }}
              keyboardType="phone-pad"
            />
            {submitErrors.phoneNumber && (
              <Text style={styles.errorText}>{submitErrors.phoneNumber}</Text>
            )}
          </View>

          
          <View style={styles.inputWrapper}>
            <View style={styles.passwordRow}>
              <TextInput
                style={[
                  styles.input,
                  styles.inputPassword,
                  submitErrors.password && styles.inputError,
                ]}
                placeholder="Password"
                placeholderTextColor="#9aa089"
                value={password}
                onChangeText={(t) => {
                  setPassword(t);
                  setSubmitErrors((prev) => ({ ...prev, password: "" }));
                }}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye" : "eye-off"}
                  size={22}
                  color="#4C2A13"
                />
              </TouchableOpacity>
            </View>
            {submitErrors.password && (
              <Text style={styles.errorText}>{submitErrors.password}</Text>
            )}
          </View>

          <View style={styles.inputWrapper}>
            <TextInput
              style={[
                styles.input,
                submitErrors.confirmPassword && styles.inputError,
              ]}
              placeholder="Confirm Password"
              placeholderTextColor="#9aa089"
              value={confirmPassword}
              onChangeText={(t) => {
                setConfirmPassword(t);
                setSubmitErrors((prev) => ({ ...prev, confirmPassword: "" }));
              }}
              secureTextEntry={true}
            />
            {submitErrors.confirmPassword && (
              <Text style={styles.errorText}>
                {submitErrors.confirmPassword}
              </Text>
            )}
          </View>

          
          <View style={styles.inputWrapper}>
            <TouchableOpacity
              style={[
                styles.input,
                styles.dropdownInput,
                submitErrors.role && styles.inputError,
              ]}
              onPress={() => setIsRolePickerVisible(true)}
            >
              <Text style={{ color: selectedRole ? "#000" : "#9aa089" }}>
                {selectedRole
                  ? selectedRole.split("_").join(" ")
                  : "Select Your Role"}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#4C2A13" />
            </TouchableOpacity>
            {submitErrors.role && (
              <Text style={styles.errorText}>{submitErrors.role}</Text>
            )}
          </View>

          
          {isPatientLinkingRequired && (
            <View style={styles.inputWrapper}>
              <TextInput
                style={[
                  styles.input,
                  styles.conditionalInput,
                  submitErrors.patientEmail && styles.inputError,
                ]}
                placeholder="Patient's Email"
                placeholderTextColor="#9aa089"
                value={patientEmail}
                onChangeText={(t) => {
                  setPatientEmail(t);
                  setSubmitErrors((prev) => ({ ...prev, patientEmail: "" }));
                }}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {submitErrors.patientEmail && (
                <Text style={styles.errorText}>
                  {submitErrors.patientEmail}
                </Text>
              )}
            </View>
          )}

          
          {isPatientPasswordRequired && (
            <View style={styles.inputWrapper}>
              <TextInput
                style={[
                  styles.input,
                  styles.conditionalInput,
                  submitErrors.patientPassword && styles.inputError,
                ]}
                placeholder="Patient's Password"
                placeholderTextColor="#9aa089"
                value={patientPassword}
                onChangeText={(t) => {
                  setPatientPassword(t);
                  setSubmitErrors((prev) => ({ ...prev, patientPassword: "" }));
                }}
                secureTextEntry={true}
              />
              {submitErrors.patientPassword && (
                <Text style={styles.errorText}>
                  {submitErrors.patientPassword}
                </Text>
              )}
            </View>
          )}

          {generalError ? (
            <Text style={styles.generalErrorText}>{generalError}</Text>
          ) : null}

          
          <TouchableOpacity
            style={[styles.registerBtn, isLoading && { opacity: 0.7 }]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            <Text style={styles.registerText}>
              {isLoading ? "Creating Account..." : "Register"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("login/login")}>
            <Text style={styles.link}>Already have an account? Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <RolePickerModal
        isVisible={isRolePickerVisible}
        onSelect={setSelectedRole}
        onClose={() => setIsRolePickerVisible(false)}
        selectedRole={selectedRole}
      />
    </KeyboardAvoidingView>
  );
}
