import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { jest } from "@jest/globals"
import ChatPage from "@/app/chat/page"

// Mock des dépendances
jest.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      getUser: jest.fn().mockResolvedValue({
        data: { user: { id: "1", email: "test@example.com" } },
      }),
      onAuthStateChange: jest.fn().mockReturnValue({
        data: { subscription: { unsubscribe: jest.fn() } },
      }),
    },
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({ data: [], error: null }),
        }),
      }),
    }),
  },
}))

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}))

// Mock fetch global
global.fetch = jest.fn()

describe("ChatPage", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test("affiche le message de bienvenue initial", async () => {
    render(<ChatPage />)

    await waitFor(() => {
      expect(screen.getByText("Comment puis-je vous aider aujourd'hui ?")).toBeInTheDocument()
    })
  })

  test("permet d'envoyer un message", async () => {
    const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        message: "Réponse de test",
        sources: ["Test"],
      }),
    } as Response)

    render(<ChatPage />)

    const input = screen.getByPlaceholderText("Posez votre question de santé...")
    const sendButton = screen.getByRole("button", { name: /envoyer/i })

    fireEvent.change(input, { target: { value: "Test question" } })
    fireEvent.click(sendButton)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/chat/enhanced",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: expect.stringContaining("Test question"),
        }),
      )
    })
  })

  test("affiche un message d'erreur en cas d'échec", async () => {
    const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>
    mockFetch.mockRejectedValueOnce(new Error("Network error"))

    render(<ChatPage />)

    const input = screen.getByPlaceholderText("Posez votre question de santé...")
    const sendButton = screen.getByRole("button", { name: /envoyer/i })

    fireEvent.change(input, { target: { value: "Test question" } })
    fireEvent.click(sendButton)

    await waitFor(() => {
      expect(screen.getByText(/une erreur s'est produite/i)).toBeInTheDocument()
    })
  })
})
