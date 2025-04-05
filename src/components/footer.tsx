export function Footer() {
  return (
    <footer className="py-6 px-6 md:px-12 border-t border-green-500/10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="text-gray-400 text-sm mb-4 md:mb-0">Copyright 2025 | Designed by GIS Factory</div>
        <div className="flex items-center space-x-6">
          <a href="#" className="text-gray-400 hover:text-green-400 transition-colors text-sm">
            Privacy Policy
          </a>
          <a href="#" className="text-gray-400 hover:text-green-400 transition-colors text-sm">
            Terms of Service
          </a>
          <a href="#" className="text-gray-400 hover:text-green-400 transition-colors text-sm">
            Contact
          </a>
        </div>
      </div>
    </footer>
  )
}

